export interface Provincia {
  nome?: string;
  codice?: string;
  sigla?: string;
}

export interface ComuniItaliani {
  nome?: string;
  codice?: string;
  zona?: any;
  regione?: any;
  cm?: any;
  provincia?: Provincia | null;
  sigla?: string;
  codiceCatastale?: string;
  cap?: any;
  popolazione?: string;
}