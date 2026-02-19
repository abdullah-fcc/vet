import type {
  Pet, PetOwner, Call, Vet, EmailTemplate, Appointment,
  VaccinationRecord, VetSchedule, DashboardStats, OwnerStatus, PetStatus,
  AppointmentStatus, TriageLevel
} from '@/types';

// ============================================
// VETS (replaces Agents)
// ============================================
export const vets: Vet[] = [
  {
    id: 'vet-1',
    firstName: 'Sarah',
    lastName: 'Kim',
    email: 'sarah.kim@pawandcare.com',
    phone: '(555) 0201',
    title: 'Lead Veterinarian',
    specialization: 'Feline Medicine',
    avatar: 'https://i.pravatar.cc/150?u=vet-1',
    activePatients: 45,
    totalAppointments: 312,
    isAvailable: true,
  },
  {
    id: 'vet-2',
    firstName: 'James',
    lastName: 'Park',
    email: 'james.park@pawandcare.com',
    phone: '(555) 0202',
    title: 'Senior Veterinarian',
    specialization: 'Emergency Medicine',
    avatar: 'https://i.pravatar.cc/150?u=vet-2',
    activePatients: 38,
    totalAppointments: 456,
    isAvailable: true,
  },
  {
    id: 'vet-3',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@pawandcare.com',
    phone: '(555) 0203',
    title: 'Veterinarian',
    specialization: 'Dental Care',
    avatar: 'https://i.pravatar.cc/150?u=vet-3',
    activePatients: 30,
    totalAppointments: 189,
    isAvailable: true,
  },
  {
    id: 'vet-4',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@pawandcare.com',
    phone: '(555) 0204',
    title: 'Veterinarian',
    specialization: 'Exotic Animals',
    avatar: 'https://i.pravatar.cc/150?u=vet-4',
    activePatients: 22,
    totalAppointments: 95,
    isAvailable: false,
  },
];

// ============================================
// PETS (replaces Properties)
// ============================================
export const pets: Pet[] = [
  {
    id: 'pet-1',
    ownerId: 'owner-1',
    name: 'Whiskers',
    species: 'cat',
    breed: 'Domestic Shorthair',
    color: 'Orange Tabby',
    gender: 'female',
    dateOfBirth: '2022-03-15',
    weightKg: 3.5,
    isNeutered: true,
    isMicrochipped: true,
    microchipNumber: 'MC-9821-4567',
    knownConditions: [],
    allergies: [],
    currentMedications: [],
    age: 4,
    weight: 7.7,
    sex: 'female',
    conditions: [],
    medications: [],
    lastVisit: '2026-02-15',
    microchipId: 'MC-9821-4567',
    photos: [
      { id: 'ph-1', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', caption: 'Whiskers', isPrimary: true },
    ],
    primaryVetId: 'vet-1',
    status: 'active',
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2026-02-15T14:30:00Z',
  },
  {
    id: 'pet-2',
    ownerId: 'owner-2',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    color: 'Golden',
    gender: 'male',
    dateOfBirth: '2020-07-22',
    weightKg: 32.0,
    isNeutered: true,
    isMicrochipped: true,
    microchipNumber: 'MC-5543-8890',
    knownConditions: ['Hip Dysplasia'],
    allergies: ['Chicken'],
    currentMedications: ['Glucosamine 500mg daily'],
    age: 5,
    weight: 70.4,
    sex: 'male',
    conditions: ['Hip Dysplasia'],
    medications: ['Glucosamine 500mg daily'],
    dietNotes: 'Grain-free diet, chicken-free protein',
    lastVisit: '2026-02-10',
    microchipId: 'MC-5543-8890',
    photos: [
      { id: 'ph-2', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400', caption: 'Max', isPrimary: true },
    ],
    primaryVetId: 'vet-2',
    status: 'active',
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'pet-3',
    ownerId: 'owner-3',
    name: 'Bella',
    species: 'dog',
    breed: 'French Bulldog',
    color: 'Brindle',
    gender: 'female',
    dateOfBirth: '2021-11-05',
    weightKg: 11.2,
    isNeutered: true,
    isMicrochipped: true,
    microchipNumber: 'MC-7732-1234',
    knownConditions: ['Allergic Dermatitis'],
    allergies: ['Beef', 'Wheat'],
    currentMedications: ['Apoquel 16mg daily'],
    age: 4,
    weight: 24.6,
    sex: 'female',
    conditions: ['Allergic Dermatitis'],
    medications: ['Apoquel 16mg daily'],
    dietNotes: 'Limited ingredient diet recommended',
    microchipId: 'MC-7732-1234',
    photos: [
      { id: 'ph-3', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400', caption: 'Bella', isPrimary: true },
    ],
    primaryVetId: 'vet-1',
    status: 'active',
    createdAt: '2023-05-20T14:00:00Z',
    updatedAt: '2026-02-18T09:15:00Z',
  },
  {
    id: 'pet-4',
    ownerId: 'owner-1',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    color: 'Seal Point',
    gender: 'female',
    dateOfBirth: '2023-09-01',
    weightKg: 3.8,
    isNeutered: true,
    isMicrochipped: false,
    knownConditions: [],
    allergies: [],
    currentMedications: [],
    age: 2,
    weight: 8.4,
    sex: 'female',
    conditions: [],
    medications: [],
    lastVisit: '2026-01-20',
    photos: [
      { id: 'ph-4', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400', caption: 'Luna', isPrimary: true },
    ],
    primaryVetId: 'vet-1',
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2026-01-20T16:00:00Z',
  },
  {
    id: 'pet-5',
    ownerId: 'owner-4',
    name: 'Rocky',
    species: 'dog',
    breed: 'German Shepherd',
    color: 'Black & Tan',
    gender: 'male',
    dateOfBirth: '2019-04-12',
    weightKg: 38.5,
    isNeutered: true,
    isMicrochipped: true,
    microchipNumber: 'MC-2211-6678',
    knownConditions: ['Arthritis'],
    allergies: [],
    currentMedications: ['Carprofen 75mg twice daily', 'Joint supplement'],
    age: 6,
    weight: 84.7,
    sex: 'male',
    conditions: ['Arthritis'],
    medications: ['Carprofen 75mg twice daily', 'Joint supplement'],
    lastVisit: '2026-02-05',
    microchipId: 'MC-2211-6678',
    photos: [
      { id: 'ph-5', url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400', caption: 'Rocky', isPrimary: true },
    ],
    primaryVetId: 'vet-2',
    status: 'active',
    createdAt: '2022-08-01T09:00:00Z',
    updatedAt: '2026-02-05T10:30:00Z',
  },
  {
    id: 'pet-6',
    ownerId: 'owner-5',
    name: 'Coco',
    species: 'bird',
    breed: 'Cockatiel',
    color: 'Grey & Yellow',
    gender: 'male',
    dateOfBirth: '2022-06-15',
    weightKg: 0.09,
    isNeutered: false,
    isMicrochipped: false,
    knownConditions: [],
    allergies: [],
    currentMedications: [],
    age: 3,
    weight: 0.2,
    sex: 'male',
    conditions: [],
    medications: [],
    lastVisit: '2026-01-15',
    photos: [
      { id: 'ph-6', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400', caption: 'Coco', isPrimary: true },
    ],
    primaryVetId: 'vet-4',
    status: 'active',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2026-01-15T15:00:00Z',
  },
];

// ============================================
// PET OWNERS (replaces Leads)
// ============================================
export const petOwners: PetOwner[] = [
  {
    id: 'owner-1',
    firstName: 'Emily',
    lastName: 'Clarke',
    email: 'emily.clarke@gmail.com',
    phone: '(555) 987-6543',
    emergencyContactName: 'Tom Clarke',
    emergencyContactPhone: '(555) 987-6544',
    source: 'AI Call',
    status: 'Appointment Booked',
    engagementScore: 85,
    assignedVetId: 'vet-1',
    preferredVetId: 'vet-1',
    notes: 'Has two cats — Whiskers and Luna. Very attentive owner, calls promptly when issues arise.',
    pets: ['pet-1', 'pet-4'],
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2026-02-19T14:34:00Z',
    lastContactAt: '2026-02-19T14:34:00Z',
    preferredContact: 'phone',
    address: '123 Maple St, Springfield',
    emergencyContact: 'Tom Clarke',
    lastVisit: '2026-02-19T14:34:00Z',
  },
  {
    id: 'owner-2',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@email.com',
    phone: '(555) 123-4567',
    source: 'AI Call',
    status: 'Regular Client',
    engagementScore: 92,
    assignedVetId: 'vet-2',
    preferredVetId: 'vet-2',
    notes: 'Max has hip dysplasia — needs regular check-ups. Very loyal client, always on time.',
    pets: ['pet-2'],
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
    lastContactAt: '2026-02-10T11:00:00Z',
    preferredContact: 'phone',
    address: '456 Oak Ave, Springfield',
    lastVisit: '2026-02-10T11:00:00Z',
  },
  {
    id: 'owner-3',
    firstName: 'Sophie',
    lastName: 'Williams',
    email: 'sophie.w@techco.com',
    phone: '(555) 234-5678',
    source: 'Website',
    status: 'New Client',
    engagementScore: 55,
    notes: 'New client — Bella has skin allergies. First appointment pending.',
    pets: ['pet-3'],
    createdAt: '2026-02-18T09:00:00Z',
    updatedAt: '2026-02-18T09:00:00Z',
    lastContactAt: undefined,
    preferredContact: 'phone',
  },
  {
    id: 'owner-4',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'rob.martinez@gmail.com',
    phone: '(555) 345-6789',
    source: 'Referral',
    status: 'Regular Client',
    engagementScore: 88,
    assignedVetId: 'vet-2',
    preferredVetId: 'vet-2',
    notes: 'Rocky is aging — arthritis management. Very involved with treatment plan.',
    pets: ['pet-5'],
    createdAt: '2022-08-01T09:00:00Z',
    updatedAt: '2026-02-05T10:30:00Z',
    lastContactAt: '2026-02-05T10:30:00Z',
    preferredContact: 'phone',
    lastVisit: '2026-02-05T10:30:00Z',
  },
  {
    id: 'owner-5',
    firstName: 'Aisha',
    lastName: 'Patel',
    email: 'aisha.p@email.com',
    phone: '(555) 456-7890',
    source: 'AI Call',
    status: 'Contacted',
    engagementScore: 40,
    notes: 'Has a cockatiel. Called about nutrition questions.',
    pets: ['pet-6'],
    createdAt: '2026-02-15T16:00:00Z',
    updatedAt: '2026-02-15T16:30:00Z',
    lastContactAt: '2026-02-15T16:00:00Z',
    preferredContact: 'phone',
    lastVisit: '2026-02-15T16:00:00Z',
  },
  {
    id: 'owner-6',
    firstName: 'Karen',
    lastName: 'Thompson',
    email: 'karen.t@email.com',
    phone: '(555) 567-8901',
    source: 'Walk-in',
    status: 'Churned',
    engagementScore: 15,
    notes: 'Has not been back since last visit 8 months ago. Moved out of area.',
    pets: [],
    createdAt: '2025-03-10T10:00:00Z',
    updatedAt: '2025-06-15T14:00:00Z',
    lastContactAt: '2025-06-15T14:00:00Z',
    preferredContact: 'phone',
    lastVisit: '2025-06-15T14:00:00Z',
  },
  {
    id: 'owner-7',
    firstName: 'Daniel',
    lastName: 'Lee',
    email: 'daniel.lee@email.com',
    phone: '(555) 678-9012',
    source: 'AI Call',
    status: 'New Client',
    engagementScore: 60,
    notes: 'Called about a new puppy. Looking for a wellness check and vaccinations.',
    pets: [],
    createdAt: '2026-02-19T11:30:00Z',
    updatedAt: '2026-02-19T11:30:00Z',
    lastContactAt: undefined,
    preferredContact: 'phone',
  },
];

// ============================================
// APPOINTMENTS (new)
// ============================================
export const appointments: Appointment[] = [
  {
    id: 'appt-1',
    petId: 'pet-1',
    petName: 'Whiskers',
    ownerId: 'owner-1',
    ownerName: 'Emily Clarke',
    vetId: 'vet-1',
    appointmentType: 'urgent',
    reason: 'Vomiting for 8 hours',
    symptoms: ['vomiting', 'lethargy', 'not eating'],
    triageLevel: 'urgent',
    scheduledDate: '2026-02-19',
    scheduledTime: '15:30',
    durationMinutes: 30,
    status: 'confirmed',
    callId: 'call-1',
    confirmationSent: true,
    reminder24hSent: false,
    reminder2hSent: false,
    createdAt: '2026-02-19T14:35:00Z',
    updatedAt: '2026-02-19T14:35:00Z',
    type: 'urgent',
  },
  {
    id: 'appt-2',
    petId: 'pet-2',
    petName: 'Max',
    ownerId: 'owner-2',
    ownerName: 'Marcus Johnson',
    vetId: 'vet-2',
    appointmentType: 'wellness',
    reason: 'Quarterly hip check-up',
    symptoms: [],
    triageLevel: 'routine',
    scheduledDate: '2026-02-20',
    scheduledTime: '10:00',
    durationMinutes: 45,
    status: 'scheduled',
    confirmationSent: true,
    reminder24hSent: false,
    reminder2hSent: false,
    createdAt: '2026-02-12T11:00:00Z',
    updatedAt: '2026-02-12T11:00:00Z',
    type: 'wellness',
  },
  {
    id: 'appt-3',
    petId: 'pet-3',
    petName: 'Bella',
    ownerId: 'owner-3',
    ownerName: 'Sophie Williams',
    vetId: 'vet-1',
    appointmentType: 'wellness',
    reason: 'New patient wellness exam + skin evaluation',
    symptoms: ['itchy skin', 'hair loss on belly'],
    triageLevel: 'routine',
    scheduledDate: '2026-02-21',
    scheduledTime: '11:00',
    durationMinutes: 60,
    status: 'scheduled',
    confirmationSent: true,
    reminder24hSent: false,
    reminder2hSent: false,
    createdAt: '2026-02-18T09:30:00Z',
    updatedAt: '2026-02-18T09:30:00Z',
    type: 'wellness',
  },
  {
    id: 'appt-4',
    petId: 'pet-5',
    petName: 'Rocky',
    ownerId: 'owner-4',
    ownerName: 'Robert Martinez',
    vetId: 'vet-2',
    appointmentType: 'follow_up',
    reason: 'Arthritis medication review',
    symptoms: ['stiffness', 'reduced mobility'],
    triageLevel: 'routine',
    scheduledDate: '2026-02-19',
    scheduledTime: '09:00',
    durationMinutes: 30,
    status: 'completed',
    diagnosis: 'Arthritis stable. Continue current medication.',
    treatmentNotes: 'Adjusted Carprofen dosage slightly. Added fish oil supplement.',
    prescriptions: ['Carprofen 75mg BID', 'Fish Oil 1000mg daily'],
    followUpDate: '2026-04-19',
    confirmationSent: true,
    reminder24hSent: true,
    reminder2hSent: true,
    createdAt: '2026-02-05T10:30:00Z',
    updatedAt: '2026-02-19T09:45:00Z',
    type: 'follow_up',
    notes: 'Stable condition, continue monitoring',
  },
  {
    id: 'appt-5',
    petId: 'pet-4',
    petName: 'Luna',
    ownerId: 'owner-1',
    ownerName: 'Emily Clarke',
    vetId: 'vet-1',
    appointmentType: 'dental',
    reason: 'Annual dental cleaning',
    symptoms: [],
    triageLevel: 'routine',
    scheduledDate: '2026-02-25',
    scheduledTime: '14:00',
    durationMinutes: 60,
    status: 'scheduled',
    confirmationSent: true,
    reminder24hSent: false,
    reminder2hSent: false,
    createdAt: '2026-02-10T15:00:00Z',
    updatedAt: '2026-02-10T15:00:00Z',
    type: 'dental',
  },
];

// ============================================
// CALLS (adapted from real estate)
// ============================================
export const calls: Call[] = [
  {
    id: 'call-1',
    ownerId: 'owner-1',
    ownerName: 'Emily Clarke',
    petName: 'Whiskers',
    direction: 'inbound',
    status: 'completed',
    durationSeconds: 198,
    triageLevel: 'urgent',
    triageKeywords: ['vomiting', 'lethargy'],
    transcriptMessages: [
      { speaker: 'AI', text: 'Thank you for calling Paw & Care Veterinary Clinic. I\'m Luna, your clinic assistant. I\'m here to help you and your pet. What\'s going on today?', timestamp: 0 },
      { speaker: 'Caller', text: 'Hi, my cat Whiskers has been throwing up a lot since this morning.', timestamp: 5 },
      { speaker: 'AI', text: 'I\'m sorry to hear that — let\'s get Whiskers sorted out. Before we go further, is Whiskers breathing normally and is there any blood?', timestamp: 10 },
      { speaker: 'Caller', text: 'Yes she\'s breathing fine, no blood.', timestamp: 18 },
      { speaker: 'AI', text: 'Good, that helps. How old is Whiskers?', timestamp: 22 },
      { speaker: 'Caller', text: 'She\'s 4 years old.', timestamp: 26 },
      { speaker: 'AI', text: 'And how many times has she vomited since it started?', timestamp: 30 },
      { speaker: 'Caller', text: 'Maybe 5 or 6 times.', timestamp: 35 },
      { speaker: 'AI', text: 'Is she still drinking water and moving around?', timestamp: 38 },
      { speaker: 'Caller', text: 'She\'s drinking a little, but she seems really tired.', timestamp: 42 },
      { speaker: 'AI', text: 'Okay, this sounds like something we should look at today. May I have your name please?', timestamp: 48 },
      { speaker: 'Caller', text: 'Emily Clarke.', timestamp: 53 },
      { speaker: 'AI', text: 'And your best email address, Emily?', timestamp: 56 },
      { speaker: 'Caller', text: 'emily.clarke at gmail dot com.', timestamp: 60 },
      { speaker: 'AI', text: 'Let me check our urgent availability for today... Great news — I have Dr. Sarah Kim available today at 3:30 PM and Dr. James Park at 5:00 PM. Do you have a preference?', timestamp: 65 },
      { speaker: 'Caller', text: '3:30 sounds perfect.', timestamp: 80 },
      { speaker: 'AI', text: 'Perfect! I\'ve booked Whiskers in with Dr. Kim at 3:30 PM today. A confirmation email is on its way. One thing — please don\'t feed Whiskers anything before the visit. Is there anything else I can help with?', timestamp: 85 },
      { speaker: 'Caller', text: 'No that\'s great, thank you!', timestamp: 100 },
      { speaker: 'AI', text: 'You\'re welcome! Whiskers is lucky to have such a caring owner. We\'ll see you both at 3:30. Take care!', timestamp: 105 },
    ],
    triageData: {
      petName: 'Whiskers',
      petSpecies: 'Cat',
      symptoms: ['Vomiting 5-6 times', 'lethargy', 'reduced appetite'],
      duration: '8 hours (since morning)',
      triageLevel: 'Urgent',
      urgency: 'Same-day appointment needed',
    },
    appointmentBooked: 'appt-1',
    vetId: 'vet-1',
    startedAt: '2026-02-19T14:30:00Z',
    endedAt: '2026-02-19T14:33:18Z',
    followUpEmailSent: true,
    summary: 'Owner called about cat vomiting for 8 hours. Triaged as urgent. Booked same-day appointment with Dr. Kim at 3:30 PM.',
  },
  {
    id: 'call-2',
    ownerId: 'owner-2',
    ownerName: 'Marcus Johnson',
    petName: 'Max',
    direction: 'inbound',
    status: 'completed',
    durationSeconds: 145,
    triageLevel: 'routine',
    transcriptMessages: [
      { speaker: 'AI', text: 'Thank you for calling Paw & Care Veterinary Clinic. I\'m Luna. How can I help you today?', timestamp: 0 },
      { speaker: 'Caller', text: 'Hi, I need to book Max\'s quarterly hip check-up.', timestamp: 4 },
      { speaker: 'AI', text: 'Of course! I see Max is due for his hip check. Would you like to see Dr. Park as usual?', timestamp: 9 },
      { speaker: 'Caller', text: 'Yes please, sometime next week.', timestamp: 15 },
      { speaker: 'AI', text: 'Dr. Park has availability on Thursday February 20th at 10:00 AM. Would that work?', timestamp: 20 },
      { speaker: 'Caller', text: 'That\'s perfect.', timestamp: 28 },
      { speaker: 'AI', text: 'Great! I\'ve booked Max in with Dr. Park on Thursday at 10 AM. You\'ll receive a confirmation email shortly. Is there anything else?', timestamp: 32 },
      { speaker: 'Caller', text: 'No, thanks Luna!', timestamp: 42 },
      { speaker: 'AI', text: 'You\'re welcome, Marcus! Give Max a pat from us. See you Thursday!', timestamp: 45 },
    ],
    triageData: {
      petName: 'Max',
      petSpecies: 'Dog',
      symptoms: ['Routine check-up', 'hip dysplasia monitoring'],
      duration: 'Ongoing condition',
      triageLevel: 'Routine',
      urgency: 'Scheduled within a week',
    },
    appointmentBooked: 'appt-2',
    vetId: 'vet-2',
    startedAt: '2026-02-12T10:00:00Z',
    endedAt: '2026-02-12T10:02:25Z',
    followUpEmailSent: true,
    summary: 'Regular client calling to schedule quarterly hip check-up for Max. Booked with Dr. Park on Feb 20.',
  },
  {
    id: 'call-3',
    ownerId: 'owner-5',
    ownerName: 'Aisha Patel',
    petName: 'Coco',
    direction: 'inbound',
    status: 'transferred',
    durationSeconds: 95,
    triageLevel: 'info',
    transcriptMessages: [
      { speaker: 'AI', text: 'Thank you for calling Paw & Care Veterinary Clinic. I\'m Luna. How can I help?', timestamp: 0 },
      { speaker: 'Caller', text: 'Hi, I have a cockatiel and I\'m wondering about diet recommendations.', timestamp: 5 },
      { speaker: 'AI', text: 'I\'d be happy to help with that! For general nutrition guidance, our exotic animal specialist Dr. Chen would be the best person to talk to. Would you like me to connect you?', timestamp: 10 },
      { speaker: 'Caller', text: 'Yes please, that would be great.', timestamp: 20 },
      { speaker: 'AI', text: 'Let me transfer you to Dr. Chen\'s line now. May I have your name first?', timestamp: 24 },
      { speaker: 'Caller', text: 'Aisha Patel.', timestamp: 28 },
      { speaker: 'AI', text: 'Thank you, Aisha. Transferring you now.', timestamp: 31 },
    ],
    triageData: {
      petName: 'Coco',
      petSpecies: 'Bird (Cockatiel)',
      symptoms: ['None — nutrition inquiry'],
      triageLevel: 'Info',
      urgency: 'Non-urgent — informational',
    },
    handoffReason: 'Nutrition inquiry — transferred to exotic specialist',
    vetId: 'vet-4',
    startedAt: '2026-02-15T16:00:00Z',
    endedAt: '2026-02-15T16:01:35Z',
    followUpEmailSent: false,
    summary: 'Owner inquired about cockatiel nutrition. Transferred to exotic specialist Dr. Chen.',
  },
  {
    id: 'call-4',
    ownerName: 'Unknown Caller',
    direction: 'inbound',
    status: 'emergency',
    durationSeconds: 48,
    triageLevel: 'emergency',
    triageKeywords: ['seizure', 'emergency'],
    transcriptMessages: [
      { speaker: 'AI', text: 'Thank you for calling Paw & Care Veterinary Clinic. I\'m Luna. How can I help?', timestamp: 0 },
      { speaker: 'Caller', text: 'My dog is having a seizure right now! Please help!', timestamp: 3 },
      { speaker: 'AI', text: 'I hear you — this is an emergency. I\'m connecting you to our on-call vet RIGHT NOW. While I connect you: keep your dog away from furniture so they don\'t hurt themselves. Do NOT put anything in their mouth. Time how long the seizure lasts. Connecting you now...', timestamp: 6 },
    ],
    triageData: {
      petSpecies: 'Dog',
      symptoms: ['Active seizure'],
      triageLevel: 'Emergency',
      urgency: 'IMMEDIATE — transferred to on-call vet',
    },
    handoffReason: 'Emergency — active seizure. Transferred to on-call vet immediately.',
    startedAt: '2026-02-18T23:15:00Z',
    endedAt: '2026-02-18T23:15:48Z',
    followUpEmailSent: false,
    summary: 'Emergency call — dog having active seizure. Immediately transferred to on-call vet.',
  },
];

// ============================================
// VACCINATION RECORDS
// ============================================
export const vaccinationRecords: VaccinationRecord[] = [
  { id: 'vax-1', petId: 'pet-1', vaccineName: 'FVRCP', administeredDate: '2025-08-15', nextDueDate: '2026-08-15', administeredBy: 'vet-1', batchNumber: 'B-2025-441', notes: '', createdAt: '2025-08-15T10:00:00Z', dateAdministered: '2025-08-15', status: 'current' },
  { id: 'vax-2', petId: 'pet-1', vaccineName: 'Rabies', administeredDate: '2025-08-15', nextDueDate: '2026-08-15', administeredBy: 'vet-1', batchNumber: 'B-2025-442', notes: '', createdAt: '2025-08-15T10:00:00Z', dateAdministered: '2025-08-15', status: 'current' },
  { id: 'vax-3', petId: 'pet-2', vaccineName: 'DA2PP', administeredDate: '2025-07-20', nextDueDate: '2026-07-20', administeredBy: 'vet-2', batchNumber: 'B-2025-332', notes: '', createdAt: '2025-07-20T11:00:00Z', dateAdministered: '2025-07-20', status: 'current' },
  { id: 'vax-4', petId: 'pet-2', vaccineName: 'Rabies', administeredDate: '2025-07-20', nextDueDate: '2026-07-20', administeredBy: 'vet-2', batchNumber: 'B-2025-333', notes: '', createdAt: '2025-07-20T11:00:00Z', dateAdministered: '2025-07-20', status: 'current' },
  { id: 'vax-5', petId: 'pet-2', vaccineName: 'Bordetella', administeredDate: '2025-12-01', nextDueDate: '2026-06-01', administeredBy: 'vet-2', batchNumber: 'B-2025-889', notes: 'Due for booster in 6 months', createdAt: '2025-12-01T10:00:00Z', dateAdministered: '2025-12-01', status: 'current' },
  { id: 'vax-6', petId: 'pet-3', vaccineName: 'DA2PP', administeredDate: '2025-05-20', nextDueDate: '2026-05-20', administeredBy: 'vet-1', batchNumber: 'B-2025-220', notes: '', createdAt: '2025-05-20T14:00:00Z', dateAdministered: '2025-05-20', status: 'current' },
  { id: 'vax-7', petId: 'pet-5', vaccineName: 'DA2PP', administeredDate: '2025-09-10', nextDueDate: '2026-03-10', administeredBy: 'vet-2', batchNumber: 'B-2025-567', notes: 'Overdue soon', createdAt: '2025-09-10T09:00:00Z', dateAdministered: '2025-09-10', status: 'due' },
  { id: 'vax-8', petId: 'pet-5', vaccineName: 'Rabies', administeredDate: '2025-09-10', nextDueDate: '2028-09-10', administeredBy: 'vet-2', batchNumber: 'B-2025-568', notes: '3-year rabies vaccine', createdAt: '2025-09-10T09:00:00Z', dateAdministered: '2025-09-10', status: 'current' },
];

// ============================================
// EMAIL TEMPLATES (vet-specific)
// ============================================
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'email-1',
    name: 'Appointment Confirmation',
    subject: 'Appointment Confirmed — {{petName}} @ {{clinicName}}',
    type: 'appointment-confirmation',
    body: `Hi {{ownerFirstName}}! 🐾

Your appointment is confirmed:

📅 {{appointmentDate}} at {{appointmentTime}}
👩‍⚕️ {{vetName}}
🏥 {{clinicName}} — {{clinicAddress}}
🐾 Patient: {{petName}} ({{petSpecies}})

⚠️ Pre-visit notes:
{{careInstructions}}

[ADD TO CALENDAR] [GET DIRECTIONS] [CANCEL/RESCHEDULE]

Best regards,
Luna — AI Assistant
{{clinicName}}
{{clinicPhone}}`,
    variables: ['ownerFirstName', 'petName', 'appointmentDate', 'appointmentTime', 'vetName', 'clinicName', 'clinicAddress', 'petSpecies', 'careInstructions', 'clinicPhone'],
  },
  {
    id: 'email-2',
    name: 'Appointment Reminder (24h)',
    subject: 'Reminder: {{petName}}\'s appointment is tomorrow at {{appointmentTime}}',
    type: 'appointment-reminder',
    body: `Hi {{ownerFirstName}}! 🐾

Friendly reminder that {{petName}}'s appointment is tomorrow:

📅 {{appointmentDate}} at {{appointmentTime}}
👩‍⚕️ {{vetName}}
🏥 {{clinicName}} — {{clinicAddress}}

📝 Please remember to:
• Bring {{petName}}'s current medications
• Note any changes in behavior or symptoms
• Arrive 10 minutes early for check-in

Need to reschedule?
Call us at {{clinicPhone}} or reply to this email.

See you tomorrow!
Luna — AI Assistant
{{clinicName}}`,
    variables: ['ownerFirstName', 'petName', 'appointmentDate', 'appointmentTime', 'vetName', 'clinicName', 'clinicAddress', 'clinicPhone'],
  },
  {
    id: 'email-3',
    name: 'Post-Visit Care Instructions',
    subject: 'Post-Visit Care Instructions for {{petName}}',
    type: 'post-visit',
    body: `Hi {{ownerFirstName}}! 🐾

Thank you for bringing {{petName}} in today. Here's a summary of the visit:

👩‍⚕️ Seen by: {{vetName}}
📋 Diagnosis: {{diagnosis}}

💊 Medications:
{{prescriptions}}

📝 Care Instructions:
{{careInstructions}}

📅 Follow-up: {{followUpDate}}

If {{petName}} shows any concerning symptoms, don't hesitate to call us at {{clinicPhone}}.

Take care of each other!
{{vetName}}
{{clinicName}}`,
    variables: ['ownerFirstName', 'petName', 'vetName', 'diagnosis', 'prescriptions', 'careInstructions', 'followUpDate', 'clinicPhone', 'clinicName'],
  },
  {
    id: 'email-4',
    name: 'Vaccination Due Alert',
    subject: '{{petName}}\'s {{vaccineName}} vaccine is due soon! 💉',
    type: 'vaccination-due',
    body: `Hi {{ownerFirstName}}! 🐾

It's almost time for {{petName}}'s {{vaccineName}} vaccination!

📅 Due by: {{vaccineDueDate}}
💉 Vaccine: {{vaccineName}}

Keeping vaccinations up-to-date is one of the best things you can do for {{petName}}'s health.

Would you like to schedule an appointment?

[BOOK APPOINTMENT] [CALL US]

Best regards,
Luna — AI Assistant
{{clinicName}}
{{clinicPhone}}`,
    variables: ['ownerFirstName', 'petName', 'vaccineName', 'vaccineDueDate', 'clinicName', 'clinicPhone'],
  },
  {
    id: 'email-5',
    name: 'Missed Call Follow-Up',
    subject: 'We missed your call — Paw & Care is here to help',
    type: 'missed-call',
    body: `Hi there! 🐾

We noticed you called Paw & Care Veterinary Clinic but we weren't able to connect. We're sorry we missed you!

I'm Luna, and I can help you:
✔ Book an appointment
✔ Answer questions about your pet's health
✔ Connect you with one of our veterinarians
✔ Provide after-hours guidance

[CALL US BACK] [BOOK ONLINE]

Or simply reply to this email and we'll get back to you promptly.

Best regards,
Luna — AI Assistant
Paw & Care Veterinary Clinic
{{clinicPhone}}`,
    variables: ['clinicPhone'],
  },
  {
    id: 'email-6',
    name: 'No-Show Follow-Up',
    subject: 'We missed you today — let\'s reschedule {{petName}}\'s visit',
    type: 'no-show',
    body: `Hi {{ownerFirstName}},

We noticed {{petName}} didn't make it to today's appointment with {{vetName}}.

We hope everything is okay! If something came up, we completely understand. Let's get {{petName}} rescheduled:

[RESCHEDULE NOW] [CALL US]

If {{petName}} is still experiencing symptoms, please don't delay — we're here to help.

Best regards,
Luna — AI Assistant
{{clinicName}}
{{clinicPhone}}`,
    variables: ['ownerFirstName', 'petName', 'vetName', 'clinicName', 'clinicPhone'],
  },
  {
    id: 'email-7',
    name: 'New Client Welcome',
    subject: 'Welcome to {{clinicName}}, {{ownerFirstName}}! 🎉',
    type: 'welcome',
    body: `Hi {{ownerFirstName}}! 🐾

Welcome to the Paw & Care family! We're so glad you chose us for {{petName}}'s care.

Here's what you can expect from us:
✔ 24/7 AI-powered phone support
✔ Online appointment booking
✔ Personalized care reminders
✔ Access to your pet's medical records
✔ Emergency support when you need it

Our team of experienced veterinarians is ready to provide the best care for {{petName}}.

📞 Need us? Call {{clinicPhone}} — Luna (our AI assistant) is always available!

Welcome aboard!
The Paw & Care Team`,
    variables: ['ownerFirstName', 'petName', 'clinicName', 'clinicPhone'],
  },
  {
    id: 'email-8',
    name: 'Emergency Follow-Up',
    subject: 'How is {{petName}} doing after yesterday\'s visit?',
    type: 'emergency-followup',
    body: `Hi {{ownerFirstName}},

We wanted to check in on {{petName}} after yesterday's emergency visit.

How is {{petName}} doing today? Here are some things to watch for:
{{careInstructions}}

If you notice any of the following, please call us immediately:
• Difficulty breathing
• Continued seizures
• Excessive bleeding
• Loss of consciousness

📞 Emergency Line: {{clinicPhone}}

We're here for you and {{petName}}.

Best regards,
{{vetName}}
{{clinicName}}`,
    variables: ['ownerFirstName', 'petName', 'careInstructions', 'clinicPhone', 'vetName', 'clinicName'],
  },
];

// ============================================
// DASHBOARD STATS
// ============================================
export const dashboardStats: DashboardStats = {
  totalClients: 234,
  newClientsToday: 3,
  callsToday: 18,
  appointmentsToday: 12,
  emergenciesToday: 1,
  noShowRate: 8.5,
  averageCallDuration: 156,
  emailsSent: 45,
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getVetById = (id: string) => vets.find(v => v.id === id);
export const getPetById = (id: string) => pets.find(p => p.id === id);
export const getOwnerById = (id: string) => petOwners.find(o => o.id === id);
export const getCallsByOwnerId = (ownerId: string) => calls.filter(c => c.ownerId === ownerId);
export const getAppointmentsByOwnerId = (ownerId: string) => appointments.filter(a => a.ownerId === ownerId);
export const getAppointmentsByPetId = (petId: string) => appointments.filter(a => a.petId === petId);
export const getPetsByOwnerId = (ownerId: string) => pets.filter(p => p.ownerId === ownerId);
export const getVaccinationsByPetId = (petId: string) => vaccinationRecords.filter(v => v.petId === petId);
export const getOwnersByStatus = (status: OwnerStatus) => petOwners.filter(o => o.status === status);
export const getActivePets = () => pets.filter(p => p.status === 'active');
export const getTodaysAppointments = () => {
  const today = new Date().toISOString().split('T')[0];
  return appointments.filter(a => a.scheduledDate === today || a.scheduledDate === '2026-02-19');
};

export const getSpeciesEmoji = (species: string): string => {
  switch (species) {
    case 'cat': return '🐱';
    case 'dog': return '🐕';
    case 'bird': return '🐦';
    case 'rabbit': return '🐰';
    case 'reptile': return '🦎';
    default: return '🐾';
  }
};

export const getTriageBadgeColor = (level: TriageLevel): string => {
  switch (level) {
    case 'emergency': return 'bg-red-500 text-white';
    case 'urgent': return 'bg-orange-500 text-white';
    case 'routine': return 'bg-green-500 text-white';
    case 'info': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'checked_in': return 'bg-purple-100 text-purple-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    case 'no_show': return 'bg-red-100 text-red-800';
    case 'rescheduled': return 'bg-orange-100 text-orange-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
