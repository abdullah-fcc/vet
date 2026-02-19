import { useState, useMemo } from 'react';
import {
  Phone, Search, Clock, Mail, AlertTriangle, CheckCircle,
  ArrowUpRight, Play, Pause, ChevronDown, ChevronRight,
  ExternalLink, Filter, Stethoscope,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  calls as mockCalls, formatDuration, getTriageBadgeColor,
} from '@/data/mockData';
import type { Call, TriageLevel } from '@/types';

export default function CallLogs() {
  const [calls] = useState<Call[]>(mockCalls);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [triageFilter, setTriageFilter] = useState<string>('all');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        call.ownerName.toLowerCase().includes(q) ||
        (call.petName?.toLowerCase() || '').includes(q) ||
        (call.summary?.toLowerCase() || '').includes(q);
      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
      const matchesTriage = triageFilter === 'all' || call.triageLevel === triageFilter;
      return matchesSearch && matchesStatus && matchesTriage;
    });
  }, [calls, searchQuery, statusFilter, triageFilter]);

  const totalDuration = calls.reduce((a, c) => a + c.durationSeconds, 0);
  const avgDuration = calls.length > 0 ? Math.round(totalDuration / calls.length) : 0;
  const completedCalls = calls.filter(c => c.status === 'completed').length;
  const emergencyCalls = calls.filter(c => c.triageLevel === 'emergency').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'transferred': return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      default: return <Phone className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Call Logs</h1>
          <p className="text-muted-foreground">
            Review AI-handled conversations and triage outcomes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{calls.length}</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCalls}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatDuration(avgDuration)}</p>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{emergencyCalls}</p>
              <p className="text-xs text-muted-foreground">Emergencies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by owner name, pet, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={triageFilter} onValueChange={setTriageFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Triage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Triage</SelectItem>
            <SelectItem value="emergency">🔴 Emergency</SelectItem>
            <SelectItem value="urgent">🟠 Urgent</SelectItem>
            <SelectItem value="routine">🟢 Routine</SelectItem>
            <SelectItem value="info">🔵 Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Call List */}
      <div className="space-y-3">
        {filteredCalls.map((call) => (
          <Card
            key={call.id}
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedCall(call)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(call.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{call.ownerName}</p>
                      {call.petName && <Badge variant="outline" className="text-xs">{call.petName}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{call.summary || 'No summary available'}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{new Date(call.startedAt).toLocaleString()}</span>
                      <span>{formatDuration(call.durationSeconds)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getTriageBadgeColor(call.triageLevel || 'info')}>{call.triageLevel || 'info'}</Badge>
                  <div className="flex gap-2">
                    {call.appointmentBooked && <Badge variant="secondary" className="text-xs">📅 Booked</Badge>}
                    {call.followUpEmailSent && <Mail className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              </div>

              {/* Triage keywords */}
              {call.triageKeywords && call.triageKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                  {call.triageKeywords.map(kw => (
                    <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredCalls.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Phone className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>No calls matching your filters.</p>
          </div>
        )}
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedCall.status)}
                <span>Call with {selectedCall.ownerName}</span>
                {selectedCall.petName && <Badge variant="outline">{selectedCall.petName}</Badge>}
              </DialogTitle>
              <DialogDescription>
                {new Date(selectedCall.startedAt).toLocaleString()} • {formatDuration(selectedCall.durationSeconds)}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="summary" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="triage">Triage</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="summary" className="space-y-4 m-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-muted-foreground">Status</Label><Badge className="mt-1" variant="outline">{selectedCall.status}</Badge></div>
                    <div><Label className="text-muted-foreground">Triage Level</Label><Badge className={`mt-1 ${getTriageBadgeColor(selectedCall.triageLevel || 'info')}`}>{selectedCall.triageLevel || 'info'}</Badge></div>
                    <div><Label className="text-muted-foreground">Appointment Booked</Label><p className="text-sm">{selectedCall.appointmentBooked ? '✅ Yes' : '❌ No'}</p></div>
                    <div><Label className="text-muted-foreground">Follow-up Email</Label><p className="text-sm">{selectedCall.followUpEmailSent ? '✅ Sent' : '❌ Not sent'}</p></div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">AI Summary</Label>
                    <p className="text-sm bg-muted p-3 rounded-lg mt-1">{selectedCall.summary || 'No summary available'}</p>
                  </div>
                </TabsContent>

                <TabsContent value="transcript" className="m-0">
                  {selectedCall.transcriptMessages && selectedCall.transcriptMessages.length > 0 ? (
                    <div className="bg-muted p-4 rounded-lg text-sm space-y-3 font-mono">
                      {selectedCall.transcriptMessages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.speaker === 'AI' ? 'text-primary' : ''}`}>
                          <span className="font-bold min-w-[60px]">{msg.speaker}:</span>
                          <span>{msg.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No transcript available</p>
                  )}
                </TabsContent>

                <TabsContent value="triage" className="space-y-4 m-0">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-3 mb-3">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Triage Assessment</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Level</Label>
                        <Badge className={`mt-1 ${getTriageBadgeColor(selectedCall.triageLevel || 'info')}`}>{selectedCall.triageLevel || 'info'}</Badge>
                      </div>
                      {selectedCall.triageData && (
                        <>
                          <div>
                            <Label className="text-muted-foreground">Species</Label>
                            <p className="text-sm">{selectedCall.triageData.species || '—'}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Symptoms</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedCall.triageData.symptoms?.map((s: string) => (
                                <Badge key={s} variant="destructive" className="text-xs">{s}</Badge>
                              )) || <span className="text-sm text-muted-foreground">—</span>}
                            </div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Urgency Score</Label>
                            <p className="text-sm font-medium">{selectedCall.triageData.urgencyScore || '—'}/10</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedCall.triageKeywords && selectedCall.triageKeywords.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">Detected Keywords</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedCall.triageKeywords.map(kw => (
                          <Badge key={kw} variant="secondary">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
