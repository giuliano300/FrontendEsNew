export interface HistoricRecipientStatus {
  id: number;
  recipientId: number;
  insertDate: string; 
  message?: string | null;
}