import { Recipients } from "../classes/Recipients";
import { Senders } from "../classes/Senders";
import { HistoricRecipientStatus } from "./HistoricRecipientStatus";

export interface GetDettaglioDestinatario {
  recipient: Recipients;
  sender: Senders;
  historicRecipientStatuses: HistoricRecipientStatus[];
}
