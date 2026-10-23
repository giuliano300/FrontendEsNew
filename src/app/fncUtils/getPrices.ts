import { ProductTypes } from "../interfaces/EnumTypes";

export class Prices {
  vatPrice: number = 0;
  totalPrice: number = 0;
  price: number = 0;
}

function GetVat(amount: number): number {
  // Implementa la funzione che calcola la VAT (IVA)
  // Per esempio, supponiamo 22% di IVA:
  return amount * 0.22;
}

export function GetFilePrice(
  productType: number,
  numberOfPages: number,
  colori: boolean,
  tipoPosta: string = 'Posta4'
): Prices {
  let type = 'LOL';

  if (productType === ProductTypes.ROL) {
    type = 'ROL';
  }

  if (productType === ProductTypes.TOL) {
    type = 'TOL';
  }

  // TOL - prezzo minimo previsto dal listino: € 4,07 + IVA
  if (type === 'TOL') {
    const price = 4.07;
    const vatPrice = Math.round(price * 0.22 * 100) / 100;

    return {
      price,
      vatPrice,
      totalPrice: Math.round((price + vatPrice) * 100) / 100
    } as Prices;
  }

  const count = numberOfPages;

  if (count <= 0) {
    return {
      vatPrice: 0,
      totalPrice: 0,
      price: 0
    } as Prices;
  }

  // Il listino arriva fino a 50 fogli
  if (count > 50) {
    throw new Error('Numero di pagine non supportato: massimo 50');
  }

  // Costo stampa / imbustamento:
  // 1 foglio = 0,22 €
  // ogni foglio successivo aggiunge 0,06 €
  const printingPrice = 0.22 + ((count - 1) * 0.06);

  /*
   * ROL - Raccomandata Online nazionale
   *
   * 1-4 fogli   -> tariffa postale 4,30 €
   * 5-20 fogli  -> tariffa postale 5,70 €
   * 21-50 fogli -> tariffa postale 6,87 €
   *
   * Servizio e stampa sono esenti IVA.
   */
  if (type === 'ROL') {
    let postalPrice = 0;

    if (count <= 4) {
      postalPrice = 4.30;
    } else if (count <= 20) {
      postalPrice = 5.70;
    } else {
      postalPrice = 6.87;
    }

    const totale = postalPrice + printingPrice;

    return {
      vatPrice: 0,
      price: Math.round(totale * 100) / 100,
      totalPrice: Math.round(totale * 100) / 100
    } as Prices;
  }

  /*
   * LOL - Lettera Online nazionale
   *
   * La tariffa postale è esente IVA.
   * Stampa / imbustamento / rendicontazione sono soggetti a IVA 22%.
   */
  if (type === 'LOL') {
    let postalPrice = 0;

    if (tipoPosta === 'Posta1') {
      /*
       * Posta1
       *
       * 1-20 fogli  -> 2,44 €
       * 21-50 fogli -> 5,82 €
       */
      postalPrice = count <= 20 ? 2.44 : 5.82;
    } else {
      /*
       * Posta4
       *
       * 1-4 fogli   -> 1,10 €
       * 5-20 fogli  -> 2,39 €
       * 21-50 fogli -> 3,77 €
       */
      if (count <= 4) {
        postalPrice = 1.10;
      } else if (count <= 20) {
        postalPrice = 2.39;
      } else {
        postalPrice = 3.77;
      }
    }

    // IVA solo sulla quota stampa / imbustamento
    const vatPrice = Math.round(printingPrice * 0.22 * 100) / 100;

    const price = postalPrice + printingPrice;
    const totalPrice = price + vatPrice;

    return {
      price: Math.round(price * 100) / 100,
      vatPrice,
      totalPrice: Math.round(totalPrice * 100) / 100
    } as Prices;
  }

  return {
    vatPrice: 0,
    totalPrice: 0,
    price: 0
  } as Prices;
}