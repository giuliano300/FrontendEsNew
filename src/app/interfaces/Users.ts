export interface Users {
  id?: number;
  businessName: string;
  vatNumber: string;
  email: string;
  password: string;
  address: string;
  city: string;
  zipCode: string;
  pec: string;
  usernamePoste: string;
  passwordPoste: string;
  enabled: boolean;
  deleted: boolean;
}