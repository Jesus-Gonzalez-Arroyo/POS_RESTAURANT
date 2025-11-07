import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Bill {
  private apiUrl = 'http://localhost:3000/api/v1/bills';

  constructor(private http: HttpClient) { }

  getBills() {
    return this.http.get<Bill[]>(this.apiUrl);
  }

  addBill(billData: any) {
    return this.http.post<Bill>(this.apiUrl, billData);
  }

  updateBill(id: number, billData: any) {
    return this.http.put<Bill>(`${this.apiUrl}/${id}`, billData);
  }

  deleteBill(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
