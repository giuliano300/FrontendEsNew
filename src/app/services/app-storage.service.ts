import { Injectable } from '@angular/core';
import { TourSeen } from '@app/interfaces/TourSeen';
import { UserOptions } from '@app/interfaces/UserOptions';
import { UserProducts } from '@app/interfaces/UserProducts';
import { Users } from '@app/interfaces/Users';

export const storageKeys = {
  authToken: 'authToken',
  user: 'user',
  userOptions: 'userOptions',
  userProducts: 'userProducts',
  userTourPage: 'userTourPage',
  pending2faData: 'pending2faData',
  userId: 'userId',
  productType: 'productType',
  sendType: 'sendType',
  bulletin: 'bulletin'
} as const;

@Injectable({ providedIn: 'root' })
export class AppStorageService {
  getAuthToken(): string | null {
    return localStorage.getItem(storageKeys.authToken);
  }

  saveAuthSession(data: any): void {
    localStorage.setItem(storageKeys.authToken, data.token);
    this.setJson(storageKeys.user, data.user);
    this.setJson(storageKeys.userOptions, data.options);
    this.setJson(storageKeys.userProducts, data.products);
    this.setJson(storageKeys.userTourPage, data.tour);
    this.remove(storageKeys.pending2faData);
  }

  clearAuthSession(): void {
    Object.values(storageKeys).forEach(key => localStorage.removeItem(key));
  }

  getUser(): Users | null {
    return this.getJson<Users>(storageKeys.user);
  }

  setUser(user: Users): void {
    this.setJson(storageKeys.user, user);
  }

  getUserOptions(): UserOptions[] {
    return this.getJson<UserOptions[]>(storageKeys.userOptions, []) ?? [];
  }

  getUserProducts(): UserProducts[] {
    return this.getJson<UserProducts[]>(storageKeys.userProducts, []) ?? [];
  }

  getTourPages(): TourSeen[] {
    return this.getJson<TourSeen[]>(storageKeys.userTourPage, []) ?? [];
  }

  setTourPages(tourPages: TourSeen[]): void {
    this.setJson(storageKeys.userTourPage, tourPages);
  }

  getPending2faData<T = unknown>(): T | null {
    return this.getJson<T>(storageKeys.pending2faData);
  }

  setPending2faData(data: unknown): void {
    this.setJson(storageKeys.pending2faData, data);
  }

  getRegistrationUserId(): string | null {
    return localStorage.getItem(storageKeys.userId);
  }

  setRegistrationUserId(userId: number | string): void {
    localStorage.setItem(storageKeys.userId, userId.toString());
  }

  clearRegistrationUserId(): void {
    this.remove(storageKeys.userId);
  }

  getProductType(): string | null {
    return this.getItem(storageKeys.productType);
  }

  setProductType(productType: number | string): void {
    this.setItem(storageKeys.productType, productType);
  }

  getSendType(): string | null {
    return this.getItem(storageKeys.sendType);
  }

  setSendType(sendType: number | string): void {
    this.setItem(storageKeys.sendType, sendType);
  }

  getBulletin(): string | null {
    return this.getItem(storageKeys.bulletin);
  }

  setBulletin(bulletin: number | string): void {
    this.setItem(storageKeys.bulletin, bulletin);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: number | string): void {
    localStorage.setItem(key, value.toString());
  }

  getJson<T>(key: string, fallback: T | null = null): T | null {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  setJson(key: string, value: unknown): void {
    if (value === undefined || value === null) {
      this.remove(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
