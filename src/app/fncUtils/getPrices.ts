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

  const round2 = (value: number): number =>
    Math.round(value * 100) / 100;

  const count = numberOfPages;

  if (count <= 0) {
    return {
      price: 0,
      vatPrice: 0,
      totalPrice: 0
    } as Prices;
  }

  /*
   * TOL - Telegramma Online
   *
   * Usiamo il prezzo minimo del listino:
   * € 4,07 + IVA 22%
   */
  if (productType === ProductTypes.TOL) {

    const price = 4.07;
    const vatPrice = round2(price * 0.22);

    return {
      price: price,
      vatPrice: vatPrice,
      totalPrice: round2(price + vatPrice)
    } as Prices;
  }

  /*
   * Il listino gestisce fino a 50 fogli.
   */
  if (count > 50) {
    throw new Error('Numero massimo di pagine supportato: 50');
  }

  /*
   * Costo stampa / imbustamento / rendicontazione
   *
   * 1 foglio = € 0,22
   * ogni foglio successivo = + € 0,06
   */
  const printingPrice = round2(
    0.22 + ((count - 1) * 0.06)
  );

  /*
   * =========================================================
   * ROL - RACCOMANDATA ONLINE
   * =========================================================
   *
   * Tutto esente IVA.
   */
  if (productType === ProductTypes.ROL) {

    let postalPrice: number;

    if (count <= 4) {
      postalPrice = 4.30;
    }
    else if (count <= 20) {
      postalPrice = 5.70;
    }
    else {
      postalPrice = 6.87;
    }

    const price = round2(
      postalPrice + printingPrice
    );

    return {
      price: price,
      vatPrice: 0,
      totalPrice: price
    } as Prices;
  }

  /*
   * =========================================================
   * LOL - LETTERA ONLINE
   * =========================================================
   *
   * Lettera normale = POSTA4
   *
   * La tariffa postale è ESENTE IVA.
   * La quota stampa/imbustamento/rendicontazione
   * è soggetta a IVA 22%.
   */

  let postalPrice: number;

  /*
   * POSTA1
   *
   * Utilizzata solo quando richiesta esplicitamente.
   
  if (tipoPosta === 'Posta1') {

    if (count <= 20) {
      postalPrice = 2.44;
    }
    else {
      postalPrice = 5.82;
    }
  }

  /*
   * POSTA4
   *
   * È la lettera normale/default.
   
  else {*/

    if (count <= 4) {
      postalPrice = 1.10;
    }
    else if (count <= 20) {
      postalPrice = 2.39;
    }
    else {
      postalPrice = 3.77;
    }
  /*}

  /*
   * Prezzo NETTO:
   *
   * tariffa postale
   * +
   * stampa/imbustamento
   */
  const price = round2(
    postalPrice + printingPrice
  );

  /*
   * IVA SOLO sulla quota stampa.
   */
  const vatPrice = round2(
    printingPrice * 0.22
  );

  const totalPrice = round2(
    price + vatPrice
  );

  return {
    price: price,
    vatPrice: vatPrice,
    totalPrice: totalPrice
  } as Prices;
}