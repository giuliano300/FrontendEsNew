export class Bulletins {
  id: number = 0;
  recipientId: number = 0;
  productType: number = 0;
  numeroContoCorrente: string = "";
  intestatoA: string = "";
  importoEuro: string = "";
  iban: string = "";
  eseguitoDaNominativo: string = "";
  eseguitoDaIndirizzo: string = "";
  eseguitoDaLocalita: string = "";
  annoDiRiferimento: string = "";
  eseguitoDaCap: string = "";
  codiceCliente: string = "";
  causale?: string | null = "";
  tempRecipientGuid: string | null = "";
}
