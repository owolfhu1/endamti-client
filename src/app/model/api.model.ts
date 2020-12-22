
export interface ClientParams {
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
  canSms: boolean;
  isActive: boolean;
  company: string;
  address: string;
  description: string;
}
