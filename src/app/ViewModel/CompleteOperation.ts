import { Operations } from "../classes/Operations";
import { Senders } from "../classes/Senders";
import { CompleteRecipient } from "./CompleteRecipient";

export class CompleteOperation {
  operation: Operations | undefined;
  sender: Senders | null | undefined;
  senderAR?: Senders | null | undefined;
  completeRecipient: CompleteRecipient[] | undefined;
}