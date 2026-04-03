import { Injectable } from '@angular/core';

const USER_ID_KEY = 'atom_user_id';
const USER_EMAIL_KEY = 'atom_user_email';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  setUserId(id: string): void {
    localStorage.setItem(USER_ID_KEY, id);
  }

  getUserEmail(): string | null {
    return localStorage.getItem(USER_EMAIL_KEY);
  }

  setUserEmail(email: string): void {
    localStorage.setItem(USER_EMAIL_KEY, email);
  }

  clear(): void {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  }
}
