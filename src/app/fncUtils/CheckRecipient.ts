
import { Recipients } from "../classes/Recipients";
import { ComuniXLS } from "./fncUtils";

export class checkRecipient {
  recipient: Recipients | null = null;
  valido: boolean = true;
  errore: string = '';
}

// Interfaccia del risultato di controllo
export interface Crt {
  valido: boolean;
  errore: string;
  indirizzovalido?: boolean;
}

// Accetta l'apostrofo semplice e le varianti tipografiche che possono arrivare
// da tastiere mobili, copia/incolla o file CSV.
export const POSTAL_TEXT_PATTERN = /^[A-Za-zÀÈÉÌÒÙàèéìòù0-9 .,'‘’ʼ´`°\/-]*$/;
// Il simbolo & è ammesso nei nominativi (es. "Rossi & Bianchi"), non negli altri campi postali.
export const POSTAL_NAME_PATTERN = /^[A-Za-zÀÈÉÌÒÙàèéìòù0-9 .,'‘’ʼ´`°\/&-]*$/;
const INVALID_ENCODING_PATTERN = /[�ÃÂ]/;

export function hasOnlyAllowedPostalCharacters(value: string | null | undefined): boolean {
  return POSTAL_TEXT_PATTERN.test(value ?? '');
}

export function hasOnlyAllowedNameCharacters(value: string | null | undefined): boolean {
  return POSTAL_NAME_PATTERN.test(value ?? '');
}

export function hasInvalidEncodingCharacters(value: unknown): boolean {
  return typeof value === 'string' && INVALID_ENCODING_PATTERN.test(value);
}

export function CheckRecipient(
  recipient: Recipients,
  comuni: ComuniXLS[], // lista dei comuni da controllare
  verificaFileName: boolean = true
): checkRecipient {
  let ctrl: checkRecipient = {
    recipient,
    valido: true,
    errore: ''
  };

  if (recipient.encodingError) {
    ctrl.valido = false;
    ctrl.errore = recipient.encodingError;
    return ctrl;
  }

  const invalidEncodingField = Object.entries(recipient).find(([, value]) =>
    hasInvalidEncodingCharacters(value)
  );
  if (invalidEncodingField) {
    ctrl.valido = false;
    ctrl.errore = `Il campo ${invalidEncodingField[0]} contiene caratteri non ammessi (�, Ã o Â) - destinatario`;
    return ctrl;
  }

  const cap = recipient.zipCode.replace(/\s+/g, '');

  // CONTROLLO CAP
  const crtCap = verificaCap(cap, comuni.length, recipient.state);
  if (!crtCap.valido) {
    ctrl.valido = false;
    ctrl.errore = crtCap.errore + ' - destinatario';
    return ctrl;
  }

  // CONTROLLO RAGIONE SOCIALE / NOMINATIVO
  const crtRS = verificaRagioneSociale(recipient.businessName);
  if (!crtRS.valido) {
    ctrl.valido = false;
    ctrl.errore = crtRS.errore + ' - destinatario';
    return ctrl;
 }

  // CONTROLLO INDIRIZZO
  const crtAddr = verificaIndirizzo(recipient.address);
  if (!crtAddr.valido) {
    ctrl.valido = false;
    ctrl.errore = crtAddr.errore + ' - destinatario';
    return ctrl;
  }

  const optionalPostalFields = [
    { label: 'Completamento nominativo', value: recipient.complementName, validator: hasOnlyAllowedNameCharacters },
    { label: 'Completamento indirizzo', value: recipient.complementAddress, validator: hasOnlyAllowedPostalCharacters }
  ];
  const invalidOptionalField = optionalPostalFields.find(field =>
    !!field.value && !field.validator(field.value)
  );
  if (invalidOptionalField) {
    ctrl.valido = false;
    ctrl.errore = `${invalidOptionalField.label} contiene caratteri speciali non ammessi - destinatario`;
    return ctrl;
  }

  // CONTROLLO CITTÀ
  const crtCitta = verificaCitta(recipient.city);
  if (!crtCitta.valido) {
    ctrl.valido = false;
    ctrl.errore = crtCitta.errore + ' - destinatario';
    return ctrl;
  }

  // CONTROLLO CF
  const crtCf = controlloFormaleCf(recipient.fiscalCode);
  if (!crtCf.valido) {
    ctrl.valido = false;
    ctrl.errore = 'Codice fiscale - destinatario';
    return ctrl;
  }

  // CONTROLLO PROVINCIA
  const crtProv = verificaProvincia(recipient.province, recipient.state);
  if (!crtProv.valido) {
    ctrl.valido = false;
    ctrl.errore = crtProv.errore + ' - destinatario';
    return ctrl;
  }

  // CONTROLLO CAP-COMUNE-PROVINCIA
  if (recipient.state.toLowerCase() === 'italia') {
    if (comuni.length > 0) {
      const crtCcp = verificaCapComuneProvincia(comuni, cap, recipient.city, recipient.province);
      if (!crtCcp.valido) {
        ctrl.valido = false;
        ctrl.errore = crtCcp.errore + ' - destinatario';
        return ctrl;
      }
    } else {
      ctrl.valido = false;
      ctrl.errore = 'Cap non corretto - destinatario';
      return ctrl;
    }
  }

  // CONTROLLO STATO
  const crtStato = verificaStato(recipient.state);
  if (!crtStato.valido) {
    ctrl.valido = false;
    ctrl.errore = crtStato.errore + ' - destinatario';
    return ctrl;
  }

  // CONTROLLO FILE NAME
  if (verificaFileName) {
    const crtFN = verificaFileNameFn(recipient.fileName!);
    if (!crtFN.valido) {
      ctrl.valido = false;
      ctrl.errore = crtFN.errore + ' - destinatario';
      return ctrl;
   }
  }

  const crtTag = verificaTag(recipient);
  if (!crtTag.valido) {
    ctrl.valido = false;
    ctrl.errore = crtTag.errore + ' - destinatario';
    return ctrl;
  }

  return ctrl;
}


function controlloFormaleCf(cf: string | null | undefined): Crt {
  const crt: Crt = {
    errore: '',
    valido: true,
  };

  if (!cf) {
    // se cf è null, undefined o stringa vuota => valido = true
    return crt;
  }

  const checkRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;

  if (cf.length < 16) {
    crt.errore = 'Il codice fiscale non rispetta la lunghezza minima.';
    crt.valido = false;
    return crt;
  }

  cf = Normalize(cf, false);

  if (!checkRegex.test(cf)) {
    const cf_NoOmocodia = SostituisciLettereOmocodia(cf);
    if (!checkRegex.test(cf_NoOmocodia)) {
      crt.errore = 'Il codice fiscale non è nella forma corretta.';
      crt.valido = false;
      return crt;
    }
  }

  return crt;
}

function Normalize(s: string, normalizeDiacritics: boolean): string {
  if (!s) return s;

  s = s.trim().toUpperCase();

  if (normalizeDiacritics) {
    const src = "ÀÈÉÌÒÙàèéìòù";
    const rep = "AEEIOUAEEIOU";
    for (let i = 0; i < src.length; i++) {
      // sostituisce tutte le occorrenze del carattere src[i] con rep[i]
      s = s.split(src[i]).join(rep[i]);
    }
  }
  return s;
}

function SostituisciLettereOmocodia(cf: string): string {
  const OmocodeChars = "LMNPQRSTUV";
  const cfChars = cf.split('');
  const pos = [6, 7, 9, 10, 12, 13, 14];

  pos.forEach(i => {
    const char = cfChars[i];
    // se non è un numero
    if (char && isNaN(parseInt(char, 10))) {
      const idx = OmocodeChars.indexOf(char);
      if (idx !== -1) {
        cfChars[i] = idx.toString();
      }
    }
  });

  return cfChars.join('');
}


function verificaCapComuneProvincia(
  comuni: ComuniXLS[],
  cap: string,
  city: string,
  province: string
): Crt {
  const ctrl: Crt = {
    errore: '',
    valido: true,
  };

  const msgerrore = 'i dati cap/provincia/comune non sono congruenti!';

  const normalizedCap = cap.trim();
  const normalizedCity = normalizeLocationValue(city);
  const normalizedProvince = normalizeLocationValue(province);

  // CAP, comune e provincia devono appartenere alla stessa riga del dataset.
  // In precedenza i tre valori venivano cercati separatamente nell'intero
  // elenco, quindi combinazioni incrociate (es. CAP di Roma e comune Milano)
  // potevano risultare valide.
  const hasMatchingCombination = comuni.some(comune =>
    comune.cap.trim() === normalizedCap
    && normalizeLocationValue(comune.comune) === normalizedCity
    && normalizeLocationValue(comune.sigla) === normalizedProvince
  );

  if (!hasMatchingCombination) {
    ctrl.errore = msgerrore;
    ctrl.valido = false;
  }

  return ctrl;
}

function normalizeLocationValue(value: string): string {
  return (value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019`\u00b4]/g, "'")
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function verificaFileNameFn(fileName: string): Crt {
  const ctrl: Crt = {
    errore: '',
    valido: true
  };

  if (!fileName || fileName.trim() === '') {
    ctrl.errore = 'file vuoto';
    ctrl.valido = false;
    return ctrl;
  }

  const parts = fileName.split('.');

  if (parts.length < 2) {
    ctrl.errore = "l'estensione del file non è consentita";
    ctrl.valido = false;
    return ctrl;
  }

  const extension = parts[parts.length - 1].toUpperCase();

  if (extension !== 'PDF') {
    ctrl.errore = "l'estensione del file non è consentita";
    ctrl.valido = false;
    return ctrl;
  }

  return ctrl;
}

// Funzione di verifica codice cliente
export function verificaCodiceCliente(codiceCliente: string): Crt {
  const ctrl: Crt = { valido: true, errore: '' };

  if (!codiceCliente) {
    return { valido: false, errore: 'Campo CodiceCliente vuoto - Bollettino' };
  }

  if (!/^[0-9]+$/.test(codiceCliente)) {
    return { valido: false, errore: 'Campo CodiceCliente deve contenere solo numeri' };
  }

  if (codiceCliente.length !== 18) {
    return { valido: false, errore: 'Campo CodiceCliente non ha la lunghezza consentita di 18 numeri' };
  }

  const firstCod = parseInt(codiceCliente.substring(0, 16), 10);
  const lastCod = parseInt(codiceCliente.substring(16), 10);
  const codiceControllo = firstCod % 93;

  if (codiceControllo !== lastCod) {
    return {
      valido: false,
      errore: 'Nel Campo CodiceCliente il controcodice non è valido (Primi 16 caratteri mod 93)'
    };
  }

  return ctrl;
}

// Funzione di verifica ragione sociale o nome e cognome
export function verificaRagioneSociale(
  ragioneSociale: string = '',
): Crt {
  const ctrl: Crt = { valido: true, errore: '' };

  if (ragioneSociale.length > 44) {
    return { valido: false, errore: 'Ragione sociale più di 44 caratteri' };
  }

  if (ragioneSociale.length === 0) {
    return { valido: false, errore: 'Inserire Nome e Cognome o Ragione Sociale' };
  }

  if (!hasOnlyAllowedNameCharacters(ragioneSociale)) {
    return { valido: false, errore: 'Nominativo contiene caratteri speciali non ammessi' };
  }

  return ctrl;
}

export function verificaIndirizzo(
  indirizzo: string
): Crt {
  const ctrl: Crt = { valido: true, errore: '' };

  if (indirizzo.length === 0) {
    return { valido: false, errore: 'Indirizzo vuoto' };
  }

  if (indirizzo.length > 44) {
    return {
      valido: false,
      errore: 'Indirizzo supera la lunghezza massima. Utilizzare il campo complemento indirizzo.'
    };
  }

  if (!hasOnlyAllowedPostalCharacters(indirizzo)) {
    return { valido: false, errore: 'Indirizzo contiene caratteri speciali non ammessi' };
  }

  return ctrl;
}

export function verificaIndirizzoMittente(
  indirizzo: string
): Crt {
  const ctrl: Crt = { valido: true, errore: '' };

  if (indirizzo.length === 0) {
    return { valido: false, errore: 'Indirizzo vuoto' };
  }

  if (indirizzo.length > 44) {
    return {
      valido: false,
      errore: 'Indirizzo supera la lunghezza massima. Utilizzare il campo complemento indirizzo.'
    };
  }

  return ctrl;
}


export function verificaCap(cap: string, i: number, state: string = 'italia'): Crt {
  const ctrl: Crt = {
    valido: true,
    errore: ''
  };

  if (state.toLowerCase() !== 'italia') {
    return ctrl;
  }

  if (cap.length === 0) {
    ctrl.errore = 'Cap inesistente';
    ctrl.valido = false;
  } else if (cap.length !== 5) {
    ctrl.errore = 'Lunghezza cap non valida';
    ctrl.valido = false;
  }

  if (i === 0) {
    ctrl.errore = 'Cap non valido';
    ctrl.valido = false;
  }

  return ctrl;
}

export function verificaProvincia(provincia: string, state = 'italia'): Crt {
  if (state.toLowerCase() !== 'italia') return { valido: true, errore: '' };
  if (provincia.length === 0) {
    return { valido: false, errore: 'provincia vuota' };
  }
  if (provincia.length > 2) {
    return { valido: false, errore: 'il campo provincia deve avere 2 caratteri' };
  }
  if (!onlyLetters(provincia)) {
    return { valido: false, errore: 'nel campo provincia sono inseriti caratteri non validi' };
  }
  return { valido: true, errore: '' };
}

export function verificaStato(stato: string): Crt {
  if (stato.length === 0) {
    return { valido: false, errore: 'stato vuoto' };
  }
  const statoUpper = stato.toUpperCase();
  if (statoUpper !== 'ITALIA') {
    if (statoUpper.includes('ITA')) {
      return { valido: false, errore: 'Il campo stato ITALIA deve essere scritto per esteso' };
    }  
  }
  return { valido: true, errore: '' };
}


export function verificaCitta(city: string): Crt {
  if (city.length === 0) {
    return { valido: false, errore: 'città vuota' };
  }
  if (!hasOnlyAllowedPostalCharacters(city)) {
    return { valido: false, errore: 'Città contiene caratteri speciali non ammessi' };
  }
  return { valido: true, errore: '' };
}

function verificaTag(recipient: Recipients): Crt {
  const tags = [
    { label: 'Tag1', value: recipient.tag1 },
    { label: 'Tag2', value: recipient.tag2 },
    { label: 'Tag3', value: recipient.tag3 },
    { label: 'Tag4', value: recipient.tag4 },
    { label: 'Tag5', value: recipient.tag5 },
    { label: 'Tag6', value: recipient.tag6 }
  ];

  const invalidTag = tags.find(tag => (tag.value?.length ?? 0) > 50);

  if (invalidTag) {
    return { valido: false, errore: `${invalidTag.label} supera la lunghezza massima di 50 caratteri` };
  }

  return { valido: true, errore: '' };
}

export function onlyNumbers(value: string): boolean {
    return /^[0-9]+$/.test(value);
}

export function onlyLetters(value: string): boolean {
    return /^[A-Za-zÀ-ÿ]+$/.test(value);
}
