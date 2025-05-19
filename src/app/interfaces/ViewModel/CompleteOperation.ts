import { Operations } from "../Operations";
import { CompleteRecipient } from "./CompleteRecipient";

export class CompleteOperation {
  operation: Operations | undefined;
  completeRecipient: CompleteRecipient[] | undefined;
}