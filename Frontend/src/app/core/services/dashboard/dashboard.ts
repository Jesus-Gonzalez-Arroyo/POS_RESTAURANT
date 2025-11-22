import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getDashboardData() {
    return this.http.get(this.apiUrl);
  }
}
