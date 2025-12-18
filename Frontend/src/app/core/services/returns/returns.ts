import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Returns {
  constructor(private http: HttpClient) {}
  private baseUrl = `${environment.apiUrl}/returns`;

  getAllReturns() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  createReturn(returnData: ReturnData) {
    return this.http.post<any>(`${this.baseUrl}`, returnData);
  }
}
