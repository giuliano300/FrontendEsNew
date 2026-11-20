import { Recipients } from '../classes/Recipients';
import { CheckRecipient } from './CheckRecipient';
import { ComuniXLS } from './fncUtils';

describe('CheckRecipient - congruenza CAP/comune/provincia', () => {
  const comuni: ComuniXLS[] = [
    { cap: '00100', comune: 'Roma', sigla: 'RM' },
    { cap: '20100', comune: 'Milano', sigla: 'MI' },
    { cap: '47121', comune: 'Forlì', sigla: 'FC' }
  ];

  function createRecipient(overrides: Partial<Recipients> = {}): Recipients {
    return Object.assign(new Recipients(), {
      businessName: 'Mario Rossi',
      address: 'Via Roma 1',
      zipCode: '00100',
      city: 'Roma',
      province: 'RM',
      state: 'Italia',
      fiscalCode: null
    }, overrides);
  }

  it('accetta una combinazione presente nella stessa riga del dataset', () => {
    const result = CheckRecipient(createRecipient(), comuni, false);

    expect(result.valido).toBeTrue();
  });

  it('rifiuta valori esistenti ma appartenenti a combinazioni diverse', () => {
    const result = CheckRecipient(createRecipient({
      city: 'Milano',
      province: 'MI'
    }), comuni, false);

    expect(result.valido).toBeFalse();
    expect(result.errore).toContain('cap/provincia/comune non sono congruenti');
  });

  it('rifiuta il nome parziale di un comune', () => {
    const result = CheckRecipient(createRecipient({ city: 'Rom' }), comuni, false);

    expect(result.valido).toBeFalse();
  });

  it('tollera maiuscole, spazi e accenti senza alterare la combinazione', () => {
    const result = CheckRecipient(createRecipient({
      zipCode: '47121',
      city: '  FORLI  ',
      province: 'fc'
    }), comuni, false);

    expect(result.valido).toBeTrue();
  });
});
