import { PDFDocument } from 'pdf-lib';

export interface PdfA4Validation {
  valid: boolean;
  pageCount: number;
  error?: string;
}

/** Legge il PDF e restituisce solo il numero di pagine: nessun controllo sul formato carta. */
export async function validateA4Pdf(bytes: Uint8Array): Promise<PdfA4Validation> {
  try {
    const document = await PDFDocument.load(bytes, { ignoreEncryption: false });
    const pageCount = document.getPageCount();

    return { valid: true, pageCount };
  } catch {
    return { valid: false, pageCount: 0, error: 'Il file PDF non è leggibile o è danneggiato.' };
  }
}
