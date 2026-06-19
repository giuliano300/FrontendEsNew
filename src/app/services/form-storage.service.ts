import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';
import { secretKey } from '@app/config/app-constants';
import { CryptoJS } from '@app/utils/crypto';

interface FormDB extends DBSchema {
  forms: {
    key: string;
    value: any;
  };
}

@Injectable({ providedIn: 'root' })
export class FormStorageService {
  private dbPromise = openDB<FormDB>('form-db', 1, {
    upgrade(db) {
      db.createObjectStore('forms');
    }
  });

  async saveForm(step: string, data: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put('forms', data, step);
  }

  async saveEncryptedForm<T>(step: string, data: T): Promise<void> {
    await this.saveForm(step, this.encrypt(data));
  }

  async getForm<T = any>(step: string): Promise<T | undefined> {
    const db = await this.dbPromise;
    return db.get('forms', step) as Promise<T | undefined>;
  }

  async getEncryptedForm<T>(step: string): Promise<T | undefined> {
    const encrypted = await this.getForm<string>(step);
    return encrypted ? this.decrypt<T>(encrypted) : undefined;
  }

  async deleteForm(step: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('forms', step);
  }

  async deleteForms(steps: string[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('forms', 'readwrite');
    await Promise.all(steps.map(step => tx.store.delete(step)));
    await tx.done;
  }

  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('forms');
  }

  encrypt<T>(data: T): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  }

  decrypt<T>(encrypted: string): T {
    const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  }
}
