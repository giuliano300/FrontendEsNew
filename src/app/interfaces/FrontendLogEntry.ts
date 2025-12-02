export interface FrontendLogEntry {
  level: string;
  message: string;
  messageTemplate?: string;
  sourceContext?: string;
  correlationId?: string;
  userId?: string;
  browser?: string;
  clientTime?: string; // ISO string
  exception?: string;
}
