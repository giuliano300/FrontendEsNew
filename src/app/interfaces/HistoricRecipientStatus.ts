export interface HistoricRecipientStatus {
  id: number;
  recipientId: number;
  insertDate: string; 
  outcomeDate: string; 
  message?: string | null;
  code?: string | null;
}