import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

interface DisposizioneBonifico {
  nome: string;
  cognome: string;
  codiceFiscale: string;
  via: string;
  civico: string;
  cap: string;
  importo: number;
}

@Component({
  selector: 'app-bonifici-domiciliati',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bonifici-domiciliati.component.html',
  styleUrl: './bonifici-domiciliati.component.scss'
})
export class BonificiDomiciliatiComponent {
  readonly form;

  excelFile: File | null = null;
  fileName = '';
  errorMessage = '';
  successMessage = '';
  isGenerating = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      denominazione: ['', Validators.required],
      cabOrdinante: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      contoOrdinante: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      codiceContratto: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.errorMessage = '';
    this.successMessage = '';

    if (!file) {
      this.excelFile = null;
      this.fileName = '';
      return;
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.excelFile = null;
      this.fileName = '';
      this.errorMessage = 'Sono ammessi solo file Excel in formato .xlsx.';
      input.value = '';
      return;
    }

    this.excelFile = file;
    this.fileName = file.name;
  }

  async generate(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage = 'Compila tutti i dati della società con valori validi.';
      return;
    }
    if (!this.excelFile) {
      this.errorMessage = 'Carica il file Excel con le disposizioni.';
      return;
    }

    this.isGenerating = true;
    try {
      const dispositions = await this.readExcel(this.excelFile);
      if (dispositions.length === 0) {
        throw new Error('Il file Excel non contiene disposizioni valide.');
      }

      const trace = this.generateTrace(dispositions);
      const blob = new Blob([trace], { type: 'text/plain;charset=us-ascii' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BONIFICI_DOMICILIATI.txt';
      link.click();
      URL.revokeObjectURL(url);
      this.successMessage = `Creato il tracciato con ${dispositions.length} disposizioni.`;
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Non è stato possibile elaborare il file Excel.';
    } finally {
      this.isGenerating = false;
    }
  }

  private async readExcel(file: File): Promise<DisposizioneBonifico[]> {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', raw: false });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!firstSheet) {
      throw new Error('Il file Excel non contiene alcun foglio.');
    }

    const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: '', raw: false });
    const dispositions: DisposizioneBonifico[] = [];
    const header = this.findHeader(rows);

    rows.forEach((row, index) => {
      if (header && index <= header.rowIndex) {
        return;
      }

      const values = Array.isArray(row) ? row : [];
      const item = this.readDisposition(values, header?.columns);
      const { nome, cognome, codiceFiscale, via, civico, cap, importoValue } = item;
      if (!nome && !cognome && !codiceFiscale && !importoValue) {
        return;
      }

      const importo = this.parseAmount(importoValue);
      if (!codiceFiscale) {
        throw new Error(`Riga ${index + 1}: il codice fiscale è obbligatorio.`);
      }
      if (!cap) {
        throw new Error(`Riga ${index + 1}: il CAP deve contenere cinque cifre.`);
      }
      if (!Number.isFinite(importo) || importo <= 0) {
        throw new Error(`Riga ${index + 1}: l'importo deve essere maggiore di zero.`);
      }
      dispositions.push({ nome, cognome, codiceFiscale, via, civico, cap, importo });
    });

    return dispositions;
  }

  private findHeader(rows: unknown[][]): { rowIndex: number; columns: Map<string, number> } | null {
    for (let rowIndex = 0; rowIndex < Math.min(rows.length, 10); rowIndex++) {
      const values = Array.isArray(rows[rowIndex]) ? rows[rowIndex] : [];
      const columns = new Map<string, number>();
      values.forEach((value, index) => {
        const field = this.headerField(this.text(value));
        if (field && !columns.has(field)) {
          columns.set(field, index);
        }
      });

      if (columns.has('cap') && columns.has('importo') && columns.size >= 3) {
        return { rowIndex, columns };
      }
    }
    return null;
  }

  private readDisposition(values: unknown[], columns?: Map<string, number>): {
    nome: string; cognome: string; codiceFiscale: string; via: string; civico: string; cap: string; importoValue: string;
  } {
    const value = (field: string): string => {
      const index = columns?.get(field);
      return index === undefined ? '' : this.text(values[index]);
    };

    if (columns) {
      const via = value('indirizzo') || [value('via'), value('civico')].filter(Boolean).join(' ');
      return {
        nome: value('nome') || value('nominativo'),
        cognome: value('cognome'),
        codiceFiscale: value('codiceFiscale'),
        via,
        civico: '',
        cap: this.normalizePostalCode(value('cap')),
        importoValue: value('importo')
      };
    }

    const codiceFiscaleIndex = values.findIndex(value => /^[A-Z0-9]{16}$/i.test(this.text(value).replace(/\s/g, '')));
    const cfIndex = codiceFiscaleIndex >= 0 ? codiceFiscaleIndex : 2;
    const capIndex = values.findIndex((value, index) => index > cfIndex && !!this.normalizePostalCode(this.text(value)));
    const amountIndex = this.findAmountIndex(values, capIndex);
    const addressValues = values.slice(cfIndex + 1, capIndex >= 0 ? capIndex : amountIndex >= 0 ? amountIndex : undefined);

    return {
      nome: this.text(values[Math.max(0, cfIndex - 2)]),
      cognome: this.text(values[Math.max(0, cfIndex - 1)]),
      codiceFiscale: this.text(values[cfIndex]),
      via: addressValues.map(value => this.text(value)).filter(Boolean).join(' '),
      civico: '',
      cap: capIndex >= 0 ? this.normalizePostalCode(this.text(values[capIndex])) : '',
      importoValue: amountIndex >= 0 ? this.text(values[amountIndex]) : ''
    };
  }

  private headerField(value: string): string | null {
    const key = value.toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (['nome', 'firstname'].includes(key)) return 'nome';
    if (['cognome', 'surname', 'lastname'].includes(key)) return 'cognome';
    if (['nominativo', 'beneficiario', 'intestatario'].includes(key)) return 'nominativo';
    if (['codicefiscale', 'cf', 'fiscalcode', 'codfiscale'].includes(key)) return 'codiceFiscale';
    if (['indirizzo', 'indirizzoresidenza', 'address'].includes(key)) return 'indirizzo';
    if (['via', 'strada', 'street'].includes(key)) return 'via';
    if (['civico', 'numerocivico', 'ncivico'].includes(key)) return 'civico';
    if (['cap', 'codicepostale', 'postalcode', 'zipcode'].includes(key)) return 'cap';
    if (['importo', 'totale', 'amount', 'importoeuro'].includes(key)) return 'importo';
    return null;
  }

  private findAmountIndex(values: unknown[], capIndex: number): number {
    for (let index = values.length - 1; index >= 0; index--) {
      if (index === capIndex) continue;
      const amount = this.parseAmount(this.text(values[index]));
      if (Number.isFinite(amount) && amount > 0) return index;
    }
    return -1;
  }

  private generateTrace(dispositions: DisposizioneBonifico[]): string {
    const company = this.form.getRawValue();
    const now = new Date();
    const date = this.date(now);
    const lines = [this.recordPC(company.denominazione ?? '', date)];
    let total = 0;

    dispositions.forEach((disposition, index) => {
      const progressive = index + 1;
      total += disposition.importo;
      lines.push(
        this.record10(disposition, progressive, now),
        this.record20(company.denominazione ?? '', progressive),
        this.record30(disposition, progressive),
        this.record40(disposition, progressive),
        this.record60('IDC062', progressive),
        this.record60('IDC099', progressive),
        this.record70(company.codiceContratto ?? '', progressive, now)
      );
    });

    lines.push(this.recordEF(date, dispositions.length, total, lines.length + 1));
    return `${lines.join('\r\n')}\r\n`;
  }

  private recordPC(_denominazione: string, date: string): string {
    return this.blank(1) + 'PC' + this.alpha('07601', 5) + '07601' + date + 'SUPP1' + this.blank(5) + this.blank(1) + this.number(1, 9) + this.blank(74) + 'E' + this.blank(6);
  }

  private record10(item: DisposizioneBonifico, progressive: number, now: Date): string {
    const company = this.form.getRawValue();
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    return this.blank(1) + '10' + this.number(progressive, 7) + this.blank(12) + this.date(nextDay) + '27000' +
      this.amount(item.importo, 13) + '+' + '07601' + this.number(Number(company.cabOrdinante), 5) +
      this.number(Number(company.contoOrdinante), 12) + '07601' + this.number(0, 5) + this.blank(12) +
      this.alpha('07601', 5) + '3' + this.alpha(item.codiceFiscale, 16) + this.blank(6) + 'E';
  }

  private record20(denominazione: string, progressive: number): string {
    return this.blank(1) + '20' + this.number(progressive, 7) + this.alpha(denominazione, 30) + this.alpha('', 30) + this.alpha('', 30) + this.blank(20);
  }

  private record30(item: DisposizioneBonifico, progressive: number): string {
    return this.blank(1) + '30' + this.number(progressive, 7) + this.alpha(`${item.nome} ${item.cognome}`.trim(), 90) + this.blank(20);
  }

  private record40(item: DisposizioneBonifico, progressive: number): string {
    return this.blank(1) + '40' + this.number(progressive, 7) + this.alpha(`${item.via} ${item.civico}`.trim(), 30) + this.number(Number(item.cap), 5) + this.alpha('', 25) + this.blank(50);
  }

  private record60(type: string, progressive: number): string {
    return this.blank(1) + '60' + this.number(progressive, 7) + this.alpha(type, 10) + this.alpha('COMUNICAZIONI', 60) + this.blank(40);
  }

  private record70(codiceContratto: string, progressive: number, now: Date): string {
    const key = (`BD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${this.number(progressive, 5)}${crypto.randomUUID().replaceAll('-', '')}`).slice(0, 30);
    return this.blank(1) + '70' + this.number(progressive, 7) + this.blank(11) + this.alpha(codiceContratto, 35) + this.alpha(key, 30) + this.alpha('', 16) + this.blank(18);
  }

  private recordEF(date: string, numberOfDispositions: number, total: number, numberOfRecords: number): string {
    const record = this.blank(1) + 'EF' + this.alpha('07601', 5) + '07601' + date + this.alpha('SUPP1', 5) + this.blank(5) + this.blank(1) + this.number(1, 9) + this.blank(10) + this.number(numberOfDispositions, 7) + this.blank(15) + this.amount(total, 15) + this.number(numberOfRecords, 7) + this.blank(24) + 'E' + this.blank(6);
    return record.slice(0, 120).padEnd(120, ' ');
  }

  private text(value: unknown): string { return String(value ?? '').trim(); }
  private parseAmount(value: string): number {
    const normalized = value.replace(/\s/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
    return Number(normalized);
  }
  private normalizePostalCode(value: string): string {
    // Excel can expose a numeric CAP as "100", "00100,0" or "00100.0".
    const normalized = value.trim().replace(',', '.');
    if (!/^\d+(?:\.0+)?$/.test(normalized)) {
      return '';
    }

    const digits = normalized.split('.')[0];
    return digits.padStart(5, '0');
  }
  private alpha(value: string, length: number): string { return value.padEnd(length, ' ').slice(0, length); }
  private number(value: number, length: number): string { return Math.trunc(value).toString().padStart(length, '0'); }
  private amount(value: number, length: number): string { return Math.trunc(value * 100).toString().padStart(length, '0'); }
  private blank(length: number): string { return ' '.repeat(length); }
  private date(value: Date): string { return `${String(value.getDate()).padStart(2, '0')}${String(value.getMonth() + 1).padStart(2, '0')}${String(value.getFullYear()).slice(-2)}`; }
}
