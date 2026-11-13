import { PDFDocument } from 'pdf-lib';

export interface PdfA4Validation {
  valid: boolean;
  pageCount: number;
  error?: string;
}

const A4_SHORT_SIDE = 595.28;
const A4_LONG_SIDE = 841.89;
const A4_TOLERANCE = 3;

/** Verifica tutte le pagine: A4 verticale e orizzontale sono entrambi validi. */
export async function validateA4Pdf(bytes: Uint8Array): Promise<PdfA4Validation> {
  try {
    const document = await PDFDocument.load(bytes, { ignoreEncryption: false });
    const pageCount = document.getPageCount();

    for (let index = 0; index < pageCount; index++) {
      const { width, height } = document.getPage(index).getSize();
      const shortSide = Math.min(width, height);
      const longSide = Math.max(width, height);
      if (Math.abs(shortSide - A4_SHORT_SIDE) > A4_TOLERANCE || Math.abs(longSide - A4_LONG_SIDE) > A4_TOLERANCE) {
        return { valid: false, pageCount, error: `Il PDF non è in formato A4 (pagina ${index + 1}).` };
      }
    }

    return { valid: true, pageCount };
  } catch {
    return { valid: false, pageCount: 0, error: 'Il file PDF non è leggibile o è danneggiato.' };
  }
}
