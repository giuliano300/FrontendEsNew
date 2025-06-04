export interface UserRecipients {
  id?: number;
  userId: number;
  userParentId: number;
  businessName: string;
  complementNames?: string;
  address: string;
  complementAddress?: string;
  zipCode: string;
  city: string;
  province: string;
  state: string;
  email?: string;
  mobile?: string;
  pec?: string;
  fiscalCode?: string;
}