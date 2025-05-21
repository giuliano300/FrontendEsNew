import { Bulletins } from "../classes/Bulletins";
import { Recipients } from "../classes/Recipients";
import { Senders } from "../classes/Senders";

export class CompleteRecipient {
  Recipient?: Recipients | null;
  bulletin?: Bulletins | null | undefined;
}