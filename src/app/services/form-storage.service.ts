import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';

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

  async getForm(step: string): Promise<any | undefined> {
    const db = await this.dbPromise;
    return db.get('forms', step);
  }

  async deleteForm(step: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('forms', step);
  }

  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('forms');
  }
}
