export class Operations {
  id: number = 0;
  insertDate: string = new Date().toISOString();
  userId: number = 0;
  userParentId: number = 0;
  operationType: number = 0;
  numberOfRecipient: number = 0;
  name: string = "";
  complete: boolean = true;
  areaTestOperation: boolean = false;
  error: boolean = false;
  errorMessage?: string | null;
  csvFileName?: string | null;
}