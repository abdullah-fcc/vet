// ============================================
// VetAssist AI — Type Definitions
// ============================================

// Pet Types
export type Species = 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'exotic' | 'other';
export type PetGender = 'male' | 'female' | 'unknown';
export type PetStatus = 'active' | 'deceased' | 'transferred';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  color?: string;
  gender: PetGender;
  sex: string;
  dateOfBirth?: string;
  age: number;
  weightKg?: number;
  weight: number;
  isNeutered: boolean;
  isMicrochipped: boolean;
  microchipNumber?: string;
  microchipId?: string;
  conditions: string[];
  knownConditions: string[];
  allergies: string[];
  medications: string[];
  currentMedications: string[];
  dietNotes?: string;
  photos: PetPhoto[];
  primaryVetId?: string;
  lastVisit?: string;
  status: PetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PetPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

// Pet Owner Types (replaces Lead)
export type OwnerStatus = 'New Client' | 'Contacted' | 'Appointment Booked' | 'Regular Client' | 'Churned';
export type OwnerSource = 'AI Call' | 'Walk-in' | 'Website' | 'Referral';

export interface PetOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredContact: 'phone' | 'email' | 'sms';
  source: OwnerSource;
  status: OwnerStatus;
  engagementScore: number;
  assignedVetId?: string;
  preferredVetId?: string;
  notes: string;
  pets: string[];
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
}

// Appointment Types
export type AppointmentType = 'wellness' | 'urgent' | 'emergency' | 'dental' | 'surgery' | 'grooming' | 'follow_up';
export type TriageLevel = 'emergency' | 'urgent' | 'routine' | 'info';
export type AppointmentStatus = 'pending' | 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  ownerId: string;
  ownerName: string;
  vetId: string;
  type: AppointmentType;
  appointmentType: AppointmentType;
  reason?: string;
  symptoms: string[];
  triageLevel: TriageLevel;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
  treatmentNotes?: string;
  prescriptions?: string[];
  followUpDate?: string;
  callId?: string;
  confirmationSent: boolean;
  reminder24hSent: boolean;
  reminder2hSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Call Types
export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'completed' | 'transferred' | 'missed' | 'voicemail' | 'emergency';

export interface Call {
  id: string;
  ownerId?: string;
  ownerName: string;
  petName?: string;
  direction: CallDirection;
  status: CallStatus;
  durationSeconds: number;
  summary?: string;
  triageLevel?: TriageLevel;
  triageKeywords?: string[];
  recordingUrl?: string;
  transcript?: string;
  transcriptMessages?: TranscriptMessage[];
  triageData?: TriageData;
  appointmentBooked?: string | boolean;
  handoffReason?: string;
  vetId?: string;
  startedAt: string;
  endedAt?: string;
  followUpEmailSent: boolean;
}

export interface TranscriptMessage {
  speaker: 'AI' | 'Caller';
  text: string;
  timestamp: number;
}

export interface TriageData {
  petName?: string;
  species?: string;
  petSpecies?: string;
  symptoms?: string[];
  duration?: string;
  triageLevel?: string;
  urgency?: string;
  urgencyScore?: number;
}

// Vet Types (replaces Agent)
export interface Vet {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  specialization?: string;
  avatar?: string;
  activePatients: number;
  totalAppointments: number;
  isAvailable: boolean;
}

// Vet Schedule
export interface VetSchedule {
  id: string;
  vetId: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  blockedSlots?: { start: string; end: string; reason: string }[];
  isAvailable: boolean;
}

// Available Slot
export interface AvailableSlot {
  vetId: string;
  vetName: string;
  date: string;
  time: string;
  type: AppointmentType;
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  variables: string[];
}

// Vaccination Record
export interface VaccinationRecord {
  id: string;
  petId: string;
  vaccineName: string;
  dateAdministered: string;
  administeredDate?: string;
  nextDueDate?: string;
  administeredBy?: string;
  batchNumber?: string;
  status: 'current' | 'due' | 'overdue' | 'expired';
  notes?: string;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalClients: number;
  newClientsToday: number;
  callsToday: number;
  appointmentsToday: number;
  emergenciesToday: number;
  noShowRate: number;
  averageCallDuration: number;
  emailsSent: number;
}

// Kanban Board
export interface KanbanColumn {
  id: OwnerStatus;
  title: string;
  owners: PetOwner[];
}
