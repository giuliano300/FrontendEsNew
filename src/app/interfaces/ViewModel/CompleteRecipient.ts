import { Bulletins } from "../Bulletins";
import { RecipientROL } from "../RecipientROL";
import { Senders } from "../Senders";

export class CompleteRecipient {
  recipientROL?: RecipientROL | null;
  sender: Senders | null | undefined;
  senderAR?: Senders | null | undefined;
  bulletin?: Bulletins | null | undefined;
}