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

  it('rifiuta caratteri speciali nel nominativo', () => {
    const result = CheckRecipient(createRecipient({ businessName: 'Mario @ Rossi' }), comuni, false);

    expect(result.valido).toBeFalse();
    expect(result.errore).toContain('caratteri speciali non ammessi');
  });

  it('ammette il simbolo & in nominativo e completamento nominativo', () => {
    const result = CheckRecipient(createRecipient({
      businessName: 'Rossi & Bianchi',
      complementName: 'Ufficio & Amministrazione'
    }), comuni, false);

    expect(result.valido).toBeTrue();
  });

  it('ammette l\'apostrofo in nominativo, indirizzo e relativi completamenti', () => {
    const result = CheckRecipient(createRecipient({
      businessName: "D'Angelo",
      complementName: "All'attenzione dell'ufficio acquisti",
      address: "Via dell'Industria 1",
      complementAddress: "Palazzina D'Este"
    }), comuni, false);

    expect(result.valido).toBeTrue();
  });

  it('ammette anche le varianti tipografiche dell\'apostrofo', () => {
    const result = CheckRecipient(createRecipient({
      businessName: 'D’Angelo',
      complementName: 'All‘attenzione',
      address: 'Via dellʼIndustria 1',
      complementAddress: 'Palazzina D´Este'
    }), comuni, false);

    expect(result.valido).toBeTrue();
  });

  it('ammette à ed è in nominativo, indirizzo e relativi completamenti', () => {
    const result = CheckRecipient(createRecipient({
      businessName: 'Società Caffè',
      complementName: 'Unità qualità',
      address: 'Via Città 1',
      complementAddress: 'Località Santè'
    }), comuni, false);

    expect(result.valido).toBeTrue();
  });

  it('rifiuta caratteri speciali nell\'indirizzo', () => {
    const result = CheckRecipient(createRecipient({ address: 'Via Roma <1>' }), comuni, false);

    expect(result.valido).toBeFalse();
    expect(result.errore).toContain('caratteri speciali non ammessi');
  });

  it('accetta accenti e punteggiatura postale ordinaria', () => {
    const result = CheckRecipient(createRecipient({
      businessName: "D'Angelo S.p.A.",
      address: 'Via 1° Maggio, 10/A'
    }), comuni, false);

    expect(result.valido).toBeTrue();
  });

  it('rifiuta testo con codifica danneggiata', () => {
    const result = CheckRecipient(createRecipient({ city: 'Chitt�' }), comuni, false);

    expect(result.valido).toBeFalse();
    expect(result.errore).toContain('caratteri non ammessi');
  });

  it('rifiuta anche i marcatori di codifica Ã e Â in qualunque campo', () => {
    const resultWithAtilde = CheckRecipient(createRecipient({ pec: 'utenteÃ@example.it' }), comuni, false);
    const resultWithAcircumflex = CheckRecipient(createRecipient({ tag1: 'valoreÂ' }), comuni, false);

    expect(resultWithAtilde.valido).toBeFalse();
    expect(resultWithAcircumflex.valido).toBeFalse();
  });

  it('ammette nei campi postali solo lettere italiane', () => {
    const result = CheckRecipient(createRecipient({ businessName: 'Müller' }), comuni, false);

    expect(result.valido).toBeFalse();
    expect(result.errore).toContain('caratteri speciali non ammessi');
  });
});
