import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  login(user: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { user, password });
  }
}
