// ============================================
// VetAssist AI — API Client
// ============================================

const API_BASE = import.meta.env.VITE_API_URL || '';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Pet Owners API (replaces Leads)
// ============================================
export const ownersApi = {
  getAll: () => apiRequest<any[]>('/api/owners'),
  getById: (id: string) => apiRequest<any>(`/api/owners/${id}`),
  create: (data: any) => apiRequest<any>('/api/owners', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<any>(`/api/owners/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => apiRequest<any>(`/api/owners/${id}`, { method: 'DELETE' }),
};

// ============================================
// Pets API (replaces Properties)
// ============================================
export const petsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/api/pets${query}`);
  },
  getById: (id: string) => apiRequest<any>(`/api/pets/${id}`),
  create: (data: any) => apiRequest<any>('/api/pets', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<any>(`/api/pets/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => apiRequest<any>(`/api/pets/${id}`, { method: 'DELETE' }),
};

// ============================================
// Appointments API (new)
// ============================================
export const appointmentsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>(`/api/appointments${query}`);
  },
  getById: (id: string) => apiRequest<any>(`/api/appointments/${id}`),
  create: (data: any) => apiRequest<any>('/api/appointments', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<any>(`/api/appointments/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => apiRequest<any>(`/api/appointments/${id}`, { method: 'DELETE' }),
};

// ============================================
// Available Slots API (new)
// ============================================
export const slotsApi = {
  search: (params: {
    date?: string;
    urgency?: string;
    species?: string;
    vetId?: string;
    appointmentType?: string;
  }) => {
    const queryParams: Record<string, string> = {};
    if (params.date) queryParams.date = params.date;
    if (params.urgency) queryParams.urgency = params.urgency;
    if (params.species) queryParams.species = params.species;
    if (params.vetId) queryParams.vetId = params.vetId;
    if (params.appointmentType) queryParams.appointmentType = params.appointmentType;
    const query = '?' + new URLSearchParams(queryParams).toString();
    return apiRequest<any[]>(`/api/slots${query}`);
  },
};

// ============================================
// Calls API (same structure)
// ============================================
export const callsApi = {
  getAll: () => apiRequest<any[]>('/api/calls'),
  getById: (id: string) => apiRequest<any>(`/api/calls/${id}`),
};

// ============================================
// Retell API (for web calling)
// ============================================
export const retellApi = {
  createWebCall: (agentId?: string) =>
    apiRequest<{ callId: string; accessToken: string; agentId: string }>(
      '/api/retell/create-web-call',
      { method: 'POST', body: { agentId } }
    ),
  processCall: (callId: string) =>
    apiRequest<{ success: boolean; callId: string }>(
      '/api/retell/process-call',
      { method: 'POST', body: { callId } }
    ),
};

// ============================================
// Health check
// ============================================
export const healthApi = {
  check: () =>
    apiRequest<{
      status: string;
      timestamp: string;
      services: { supabase: string; retell: string; resend: string };
    }>('/api/health'),
};
