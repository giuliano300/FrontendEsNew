export interface Users {
  id?: number;
  parentId?: number;
  userTypes?: number;
  guid: string;
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
  province?: string;
  mobile?: string;
  arraySenderId?: string;
  enabled: boolean;
  deleted: boolean;
}