import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Sale {
  customer: string
  total: string
  paymentmethod: string
  products: Array<{ name: string; price: number; quantity: number }>
  time: Date
  ganancias: string
}

@Injectable({
  providedIn: 'root'
})
export class Sales {
  private baseUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.baseUrl)
  }

  createSale(sale: Sale): Observable<any> {
    return this.http.post<any>(this.baseUrl, sale)
  }
}
