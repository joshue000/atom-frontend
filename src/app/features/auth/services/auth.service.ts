import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, CreateUserPayload } from '../../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  findByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${encodeURIComponent(email)}`);
  }

  createUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload);
  }
}
