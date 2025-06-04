import { HistoricRecipientStatus } from "./HistoricRecipientStatus";

export interface GetReportSpedizioni {
  businessName: string;
  productName: string;
  recipientId: number;
  operationId: number;
  senderName: string;
  insertDate: string; 
  price: number;
  doc?: Uint8Array | null;
  code: string;
  state: string;
  historicRecipientStatuses?: HistoricRecipientStatus[] | null;
}
