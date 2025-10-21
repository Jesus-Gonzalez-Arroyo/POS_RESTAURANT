import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Sale {
  customer: string
  total: number
  paymentmethod: string
  products: Array<{ name: string; price: number; quantity: number }>
  time: Date
  ganancias: number
}

@Injectable({
  providedIn: 'root'
})
export class Sales {
  private baseUrl = 'http://localhost:3000/api/v1/sales';

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.baseUrl)
  }

  createSale(sale: Sale): Observable<any> {
    return this.http.post<any>(this.baseUrl, sale)
  }
}
