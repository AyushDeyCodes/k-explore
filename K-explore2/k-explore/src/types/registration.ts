export type RegistrationStatus = 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  status: RegistrationStatus;
  createdAt: string;
}

export interface RegistrationInput {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
}
