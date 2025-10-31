import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoxRegister {
  private baseUrl = 'http://localhost:3000/api/v1/box';

  constructor(private http: HttpClient) { }

  getAllCashRegisters() {
    return this.http.get(`${this.baseUrl}`);
  }

  createCashRegister(registerData: any) {
    return this.http.post(`${this.baseUrl}`, registerData);
  }
}
