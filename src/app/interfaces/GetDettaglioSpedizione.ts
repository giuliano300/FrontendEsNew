import { Operations } from "../classes/Operations";
import { RecipientsExcludeFields } from "../classes/RecipientsExcludeFields";

export interface GetDettaglioSpedizione {
  operation: Operations,
  recipients: RecipientsExcludeFields[]
}