// Vercel serverless entry point — self-contained Express handler
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      retell: process.env.RETELL_API_KEY ? 'configured' : 'missing',
    },
  });
});

// ── POST /api/retell/create-web-call ──
app.post('/api/retell/create-web-call', async (req, res) => {
  try {
    const { agentId } = req.body;
    const retellApiKey = process.env.RETELL_API_KEY;

    if (!retellApiKey) {
      return res.status(500).json({ error: 'RETELL_API_KEY is not configured on the server.' });
    }

    const effectiveAgentId = agentId || process.env.RETELL_AGENT_ID;

    if (!effectiveAgentId) {
      return res.status(400).json({
        error: 'No agent ID provided. Pass agentId in the request body or set RETELL_AGENT_ID.',
      });
    }

    const retellResponse = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: effectiveAgentId }),
    });

    if (!retellResponse.ok) {
      const errorBody = await retellResponse.text();
      console.error('[Retell API Error]', retellResponse.status, errorBody);
      return res.status(retellResponse.status).json({
        error: `Retell API error: ${retellResponse.status}`,
        details: errorBody,
      });
    }

    const data: any = await retellResponse.json();
    return res.json({
      callId: data.call_id,
      accessToken: data.access_token,
      agentId: data.agent_id,
    });
  } catch (error: any) {
    console.error('[Server Error]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ── POST /api/retell/process-call ──
app.post('/api/retell/process-call', async (req, res) => {
  try {
    const { callId } = req.body;
    const retellApiKey = process.env.RETELL_API_KEY;

    if (!retellApiKey) return res.status(500).json({ error: 'RETELL_API_KEY not configured' });
    if (!callId) return res.status(400).json({ error: 'callId is required' });

    const retellResponse = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${retellApiKey}` },
    });

    if (!retellResponse.ok) {
      const errorBody = await retellResponse.text();
      return res.status(retellResponse.status).json({
        error: `Retell API error: ${retellResponse.status}`,
        details: errorBody,
      });
    }

    const callData: any = await retellResponse.json();
    return res.json({
      success: true,
      callId,
      status: callData.call_status,
      duration:
        callData.end_timestamp && callData.start_timestamp
          ? Math.round((callData.end_timestamp - callData.start_timestamp) / 1000)
          : null,
      transcript: callData.transcript || null,
    });
  } catch (error: any) {
    console.error('[Server Error]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ── POST /api/retell/webhook ──
app.post('/api/retell/webhook', (req, res) => {
  const event = req.body;
  console.log('[Retell Webhook]', event.event, event.call?.call_id);
  res.json({ received: true });
});

export default app;
