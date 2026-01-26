import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendEmails {
  private baseUrl = `${environment.apiUrl}/emails`;

  constructor(private http: HttpClient) {}

  sendRegisterOpeningEmail(data: {
    openingAmount: number;
    openingDate: string;
    openedBy: string;
    registerId?: string;
  }) {
    return this.http.post(`${this.baseUrl}/send-opening-email`, data);
  }  

  sendRegisterClosingEmail(data: {
    openingDate: string;
    closingDate: string;
    openingAmount: number;
    closingAmount: number;
    expectedAmount: number;
    difference: number;
    totalSales: number;
    totalExpenses: number;
    salesByMethod: any;
    cashAmount: number;
    openedBy: string;
    closedBy: string;
    notes: string;
  }) {
    return this.http.post(`${this.baseUrl}/send-closing-email`, data);
  }
}