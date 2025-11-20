import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/api/v1/dashboard';

  getDashboardData() {
    return this.http.get(this.apiUrl);
  }
}
