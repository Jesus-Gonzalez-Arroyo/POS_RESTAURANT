import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PaymentMethod } from '../../models/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymenthMethods {
  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:3000/api/v1/paymentMethods';

  getPaymentMethods() {
    return this.http.get(this.baseUrl);
  }

  createPaymentMethod(data: Omit<PaymentMethod, 'id'>) {
    return this.http.post(this.baseUrl, data);
  }

  updatePaymentMethod(methodId: number, data: Omit<PaymentMethod, 'id'>) {
    return this.http.put(`${this.baseUrl}/${methodId}`, data);
  }

  deletePaymentMethod(methodId: number) {
    return this.http.delete(`${this.baseUrl}/${methodId}`);
  }

  togglePaymentMethodState(methodId: number, isActive: boolean, updatedAt: Date) {
    return this.http.patch(`${this.baseUrl}/${methodId}`, { isActive, updatedAt });
  }
}
