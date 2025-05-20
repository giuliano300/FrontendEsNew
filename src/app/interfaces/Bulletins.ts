export interface Bulletins {
  id: number;
  recipientId: number;
  productType: number;
  numeroContoCorrente: string;
  intestatoA: string;
  importoEuro: string;
  eseguitoDaNominativo: string;
  eseguitoDaIndirizzo: string;
  eseguitoDaLocalita: string;
  annoDiRiferimento: string;
  eseguitoDaCap: string;
  codiceCliente: string;
  causale?: string | null;
}
