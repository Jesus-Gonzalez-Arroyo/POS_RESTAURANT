import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) { }

  login(user: string, password: string) {
    return this.http.post(`${this.apiUrl}`, { user, password });
  }
}
