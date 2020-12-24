
export interface ClientSearchParams {
  firstname?: string;
  lastname?: string;
  organization?: string;
  status?: string;
  hideInactive?: boolean;
}

export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  otherPhone: string;
  canSms: boolean;
  organization: string;
  prefix: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  entryDate: string;
  lastVisit: string;
  visits: number;
  balance: number;
  optIn: boolean;
  active: boolean;
  title: string;
  gender: string;
  status: string;
  notificationBy: string;
}

export interface Communication {
  id: number;
  clientId: number;
  username: string;
  type: string;
  destination: string;
  subject: string;
  body: string;
  date: string;
}

export interface EmailDTO {
  username: number;
  clientId: number;
  subject: string;
  body: string;
  date: string;
  to: string;
}

export interface SMSDTO {
  username: number;
  clientId: number;
  body: string;
  date: string;
  to: string;
}

export interface CommunicationSearchParams {
  sentBy?: string;
  destination?: string;
  type: string;
}

export interface Template {
  id?: number;
  type: string;
  subject?: string;
  body: string;
  title: string;
}
