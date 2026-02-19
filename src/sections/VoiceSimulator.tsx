import { useState, useRef, useEffect, useCallback } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import {
  Phone, PhoneOff, Mic, MicOff,
  AlertTriangle, Stethoscope, Calendar, PawPrint,
  Heart, Activity, Zap, Loader2,
  Radio, Wifi, WifiOff, Settings,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getTriageBadgeColor } from '@/data/mockData';
import type { TriageLevel } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TranscriptEntry {
  id: string;
  role: 'agent' | 'user';
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

interface TriageState {
  petName: string;
  species: string;
  symptoms: string[];
  urgencyScore: number;
  triageLevel: TriageLevel;
  ownerName: string;
  phone: string;
  isEmergency: boolean;
}

type CallState = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

// ─── Keyword Detection (for live triage panel) ────────────────────────────────

const EMERGENCY_KEYWORDS = [
  'bleeding', 'seizure', 'seizures', 'unconscious', 'not breathing',
  'poisoned', 'poison', 'hit by car', 'broken bone', 'choking',
  'collapse', 'collapsed', 'convulsing', 'bloat', 'swollen belly',
  'difficulty breathing', "can't breathe", 'eaten chocolate', 'eaten rat poison',
];

const URGENT_KEYWORDS = [
  'vomiting', 'diarrhea', 'limping', "won't eat", 'lethargic',
  'swelling', 'eye injury', 'pain', 'crying', 'whimpering',
  'blood in stool', 'blood in urine', 'coughing', 'difficulty walking',
];

function detectTriageFromText(text: string): {
  isEmergency: boolean;
  isUrgent: boolean;
  detectedSymptoms: string[];
} {
  const lower = text.toLowerCase();
  const detectedSymptoms: string[] = [];
  let isEmergency = false;
  let isUrgent = false;

  for (const kw of EMERGENCY_KEYWORDS) {
    if (lower.includes(kw)) {
      detectedSymptoms.push(kw);
      isEmergency = true;
    }
  }
  for (const kw of URGENT_KEYWORDS) {
    if (lower.includes(kw)) {
      detectedSymptoms.push(kw);
      isUrgent = true;
    }
  }

  return { isEmergency, isUrgent, detectedSymptoms };
}

function calculateTriageLevel(symptoms: string[], isEmergency: boolean): { level: TriageLevel; score: number } {
  if (isEmergency) return { level: 'emergency', score: 9 };
  const urgentCount = symptoms.filter(s =>
    URGENT_KEYWORDS.some(kw => s.toLowerCase().includes(kw))
  ).length;
  if (urgentCount >= 2) return { level: 'urgent', score: 7 };
  if (urgentCount >= 1) return { level: 'urgent', score: 5 };
  if (symptoms.length > 0) return { level: 'routine', score: 3 };
  return { level: 'info', score: 1 };
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function VoiceSimulator() {
  // ── Retell SDK ref ──
  const retellClientRef = useRef<RetellWebClient | null>(null);

  // ── Call state ──
  const [callState, setCallState] = useState<CallState>('idle');
  const [callId, setCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [agentTalking, setAgentTalking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agentIdOverride, setAgentIdOverride] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // ── Live transcript ──
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  // ── Live triage (auto-detected from transcript) ──
  const [triageState, setTriageState] = useState<TriageState>({
    petName: '', species: '', symptoms: [], urgencyScore: 0,
    triageLevel: 'info', ownerName: '', phone: '', isEmergency: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // ── Scroll to bottom on new transcript ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // ── Call duration timer ──
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = window.setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // ── Auto-triage from transcript ──
  const updateTriageFromTranscript = useCallback((entries: TranscriptEntry[]) => {
    const fullText = entries.map(e => e.text).join(' ');
    const userText = entries.filter(e => e.role === 'user').map(e => e.text).join(' ');

    const { isEmergency, detectedSymptoms } = detectTriageFromText(fullText);
    const { level, score } = calculateTriageLevel(detectedSymptoms, isEmergency);

    // Try to extract pet name from agent text (e.g. "Nice to meet Bella")
    const agentText = entries.filter(e => e.role === 'agent').map(e => e.text).join(' ');
    const petNameMatch = agentText.match(/(?:meet|for|about|how is|patient)\s+([A-Z][a-z]+)/);

    // Try to detect species
    const speciesMap: Record<string, string> = {
      dog: 'dog', puppy: 'dog', cat: 'cat', kitten: 'cat',
      bird: 'bird', rabbit: 'rabbit', bunny: 'rabbit',
      hamster: 'hamster', reptile: 'reptile', snake: 'reptile',
    };
    let detectedSpecies = '';
    const lower = userText.toLowerCase();
    for (const [key, val] of Object.entries(speciesMap)) {
      if (lower.includes(key)) {
        detectedSpecies = val;
        break;
      }
    }

    setTriageState(prev => ({
      ...prev,
      symptoms: [...new Set([...prev.symptoms, ...detectedSymptoms])],
      urgencyScore: Math.max(prev.urgencyScore, score),
      triageLevel: score > prev.urgencyScore ? level : prev.triageLevel,
      isEmergency: prev.isEmergency || isEmergency,
      petName: petNameMatch?.[1] || prev.petName,
      species: detectedSpecies || prev.species,
    }));
  }, []);

  // ── Initialize Retell SDK ──
  const initializeRetell = useCallback(() => {
    if (retellClientRef.current) return retellClientRef.current;

    const client = new RetellWebClient();

    client.on('call_started', () => {
      console.log('[Retell] Call started');
      setCallState('active');
    });

    client.on('call_ended', () => {
      console.log('[Retell] Call ended');
      setCallState('ended');
    });

    client.on('agent_start_talking', () => {
      setAgentTalking(true);
    });

    client.on('agent_stop_talking', () => {
      setAgentTalking(false);
    });

    client.on('update', (update: any) => {
      // update.transcript is an array of { role, content }
      if (update.transcript) {
        const newEntries: TranscriptEntry[] = update.transcript.map(
          (t: { role: string; content: string }, i: number) => ({
            id: `t-${i}`,
            role: t.role === 'agent' ? 'agent' as const : 'user' as const,
            text: t.content,
            timestamp: new Date(),
            isFinal: true,
          })
        );
        setTranscript(newEntries);
        updateTriageFromTranscript(newEntries);
      }
    });

    client.on('error', (error: any) => {
      console.error('[Retell] Error:', error);
      setErrorMessage(`Call error: ${error?.message || 'Unknown error'}`);
      setCallState('error');
    });

    retellClientRef.current = client;
    return client;
  }, [updateTriageFromTranscript]);

  // ── Start Call ──
  const startCall = async () => {
    setErrorMessage(null);
    setCallState('connecting');
    setTranscript([]);
    setCallDuration(0);
    setTriageState({
      petName: '', species: '', symptoms: [], urgencyScore: 0,
      triageLevel: 'info', ownerName: '', phone: '', isEmergency: false,
    });

    try {
      const client = initializeRetell();
      const agentId = agentIdOverride || import.meta.env.VITE_RETELL_AGENT_ID;

      if (!agentId) {
        throw new Error('No Retell Agent ID configured. Set VITE_RETELL_AGENT_ID in .env or enter it in Settings.');
      }

      // Call your backend to create a web call and get the access token
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/retell/create-web-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Failed to create web call' }));
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setCallId(data.callId);

      // Start the Retell web call with the access token
      await client.startCall({
        accessToken: data.accessToken,
      });
    } catch (err: any) {
      console.error('[Retell] Start call failed:', err);
      setErrorMessage(err.message || 'Failed to start call');
      setCallState('error');
    }
  };

  // ── End Call ──
  const endCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
    setCallState('ended');
  };

  // ── Toggle Mute ──
  const toggleMute = () => {
    if (retellClientRef.current) {
      if (isMuted) {
        retellClientRef.current.unmute();
      } else {
        retellClientRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  // ── Reset ──
  const resetCall = () => {
    setCallState('idle');
    setTranscript([]);
    setCallId(null);
    setCallDuration(0);
    setErrorMessage(null);
    setTriageState({
      petName: '', species: '', symptoms: [], urgencyScore: 0,
      triageLevel: 'info', ownerName: '', phone: '', isEmergency: false,
    });
  };

  // ── Helpers ──
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isActive = callState === 'active';
  const isConnecting = callState === 'connecting';

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voice Call — Luna AI</h1>
          <p className="text-muted-foreground">
            Live voice call with Luna using Retell AI
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>

          {callState === 'idle' || callState === 'error' || callState === 'ended' ? (
            <Button onClick={startCall} className="bg-green-600 hover:bg-green-700">
              <Phone className="mr-2 h-4 w-4" />
              {callState === 'ended' ? 'New Call' : 'Start Call'}
            </Button>
          ) : isConnecting ? (
            <Button disabled className="bg-yellow-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </Button>
          ) : (
            <Button onClick={endCall} variant="destructive">
              <PhoneOff className="mr-2 h-4 w-4" />
              End Call
            </Button>
          )}

          {callState === 'ended' && (
            <Button variant="outline" size="sm" onClick={resetCall}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="agentId" className="text-sm">Retell Agent ID</Label>
                <Input
                  id="agentId"
                  placeholder="agent_xxxxxxxxxxxx (leave blank to use .env)"
                  value={agentIdOverride}
                  onChange={(e) => setAgentIdOverride(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Override the agent ID from your .env file. Leave empty to use VITE_RETELL_AGENT_ID.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="py-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600">Call Error</p>
              <p className="text-xs text-red-500">{errorMessage}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setErrorMessage(null)}
              className="text-red-500"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Call Area */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-green-500' :
                    isConnecting ? 'bg-yellow-500' :
                    callState === 'error' ? 'bg-red-500' :
                    'bg-muted'
                  }`}>
                    <Stethoscope className={`h-5 w-5 ${
                      isActive || isConnecting || callState === 'error' ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">Luna — AI Vet Assistant</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {isActive ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          Live Call — {formatTimer(callDuration)}
                          {agentTalking && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <Radio className="h-3 w-3 animate-pulse" />
                              Speaking
                            </span>
                          )}
                        </>
                      ) : isConnecting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Connecting to Luna...
                        </>
                      ) : callState === 'ended' ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                          Call ended — {formatTimer(callDuration)}
                        </>
                      ) : (
                        <>
                          <Wifi className="h-3 w-3" />
                          Ready — click Start Call to connect
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>

                {isActive && (
                  <div className="flex gap-2">
                    <Button
                      variant={isMuted ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={toggleMute}
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 pb-4">
                  {/* Empty State */}
                  {transcript.length === 0 && callState === 'idle' && (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                      <PawPrint className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Live Voice Call with Luna</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Start a real voice call with Luna, our AI veterinary assistant powered by Retell AI.
                        She'll answer the phone, triage symptoms, and help schedule appointments — all by voice.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
                        <div className="p-3 rounded-lg border text-left">
                          <p className="font-medium text-green-600 flex items-center gap-1">
                            <Mic className="h-3 w-3" /> Real Voice
                          </p>
                          <p className="text-xs text-muted-foreground">Speak naturally via microphone</p>
                        </div>
                        <div className="p-3 rounded-lg border text-left">
                          <p className="font-medium text-blue-600 flex items-center gap-1">
                            <Activity className="h-3 w-3" /> Live Triage
                          </p>
                          <p className="text-xs text-muted-foreground">Symptoms detected in real-time</p>
                        </div>
                        <div className="p-3 rounded-lg border text-left">
                          <p className="font-medium text-orange-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Scheduling
                          </p>
                          <p className="text-xs text-muted-foreground">Book appointments by voice</p>
                        </div>
                        <div className="p-3 rounded-lg border text-left">
                          <p className="font-medium text-purple-600 flex items-center gap-1">
                            <Heart className="h-3 w-3" /> Smart AI
                          </p>
                          <p className="text-xs text-muted-foreground">P.E.T.S. triage protocol</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Connecting State */}
                  {isConnecting && transcript.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                        <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Connecting to Luna...</h3>
                      <p className="text-sm text-muted-foreground">
                        Please allow microphone access when prompted
                      </p>
                    </div>
                  )}

                  {/* Live Transcript */}
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          entry.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${
                            entry.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {entry.role === 'agent' ? '🩺 Luna' : '🗣️ You'}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Agent talking indicator */}
                  {isActive && agentTalking && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:0ms]" />
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:150ms]" />
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:300ms]" />
                          </div>
                          <span className="text-xs text-muted-foreground">Luna is speaking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Call Ended Summary */}
                  {callState === 'ended' && transcript.length > 0 && (
                    <div className="mx-auto max-w-sm text-center py-6">
                      <Separator className="mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Call ended — {formatTimer(callDuration)} duration
                      </p>
                      {callId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Call ID: {callId}
                        </p>
                      )}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Active Call Controls */}
              {isActive && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Listening via microphone
                    </div>
                    {isMuted && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <MicOff className="h-4 w-4" />
                        Muted
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel — Live Triage */}
        <div className="space-y-4">
          {/* Connection Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {isActive ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                )}
                Call Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">State</span>
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {callState === 'idle' && 'Ready'}
                  {callState === 'connecting' && 'Connecting'}
                  {callState === 'active' && 'Live'}
                  {callState === 'ended' && 'Ended'}
                  {callState === 'error' && 'Error'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-mono">{formatTimer(callDuration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Messages</span>
                <span>{transcript.length}</span>
              </div>
              {callId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Call ID</span>
                  <span className="font-mono text-xs truncate max-w-[120px]" title={callId}>
                    {callId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Triage Assessment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Live Triage
              </CardTitle>
              <CardDescription className="text-xs">
                Auto-detected from conversation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${
                  triageState.triageLevel === 'emergency' ? 'border-red-500 text-red-600' :
                  triageState.triageLevel === 'urgent' ? 'border-orange-500 text-orange-600' :
                  triageState.triageLevel === 'routine' ? 'border-green-500 text-green-600' :
                  'border-blue-300 text-blue-500'
                }`}>
                  <span className="text-2xl font-bold">{triageState.urgencyScore}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Urgency Score (0-10)</p>
                <Badge className={`mt-2 ${getTriageBadgeColor(triageState.triageLevel)}`}>
                  {triageState.triageLevel.toUpperCase()}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pet Name</span>
                  <span className="font-medium">{triageState.petName || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Species</span>
                  <span className="font-medium capitalize">{triageState.species || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Emergency</span>
                  <span className="font-medium">{triageState.isEmergency ? '🚨 Yes' : '❌ No'}</span>
                </div>
              </div>

              {triageState.symptoms.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground text-xs">Detected Symptoms</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {triageState.symptoms.map((s, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">1</span>
                  </div>
                  <span>Click "Start Call" — your browser requests mic access</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <span>Talk naturally — Luna listens and responds by voice</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">3</span>
                  </div>
                  <span>Live transcript and triage update in real-time</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-bold">4</span>
                  </div>
                  <span>Click "End Call" when done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
