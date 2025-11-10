import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/index';

@Injectable({
  providedIn: 'root'
})
export class Orders {
  private baseUrl = 'http://localhost:3000/api/v1/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  createOrder(order: Omit<Order, 'id' | 'status'>): Observable<any> {
    return this.http.post<any>(this.baseUrl, order);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${orderId}`);
  }
}
