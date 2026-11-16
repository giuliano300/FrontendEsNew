import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const countryNames = new Set(['ITALIA', 'ITALY', 'REPUBBLICA ITALIANA', 'IT']);

const normalize = (value: unknown): string =>
  String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('it-IT');

export function isNationUsedAsCity(city: unknown, state?: unknown): boolean {
  const normalizedCity = normalize(city);
  if (!normalizedCity) {
    return false;
  }

  return countryNames.has(normalizedCity)
    || (!!normalize(state) && normalizedCity === normalize(state));
}

export const cityCannotBeNationValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null =>
    isNationUsedAsCity(control.value) ? { cityIsNation: true } : null;
