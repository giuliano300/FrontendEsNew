import { Operations } from "../classes/Operations";
import { Recipients } from "../classes/Recipients";

export interface GetDettaglioSpedizione {
  operation: Operations,
  recipients: Recipients[]
}