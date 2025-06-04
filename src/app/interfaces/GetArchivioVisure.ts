export interface GetArchivioVisure {
  id: number;
  productName: string;
  businessName: string;
  sender: string;
  vat: string;
  valid: boolean;
  date: Date;
  code: string;
  state: string;
  price: number;
  doc?: Uint8Array | null;
}