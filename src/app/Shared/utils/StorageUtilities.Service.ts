import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageUtilsService {

  // Save data to local storage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve data from local storage
  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Remove item from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all data in local storage
  clear(): void {
    localStorage.clear();
  }
}
