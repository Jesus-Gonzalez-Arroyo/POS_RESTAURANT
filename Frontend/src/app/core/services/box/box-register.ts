import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashRegister, Transaction } from '../../models/index';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxRegister {
  private baseUrl = `${environment.apiUrl}/box`;

  constructor(private http: HttpClient) { }

  getAllCashRegisters() {
    return this.http.get(`${this.baseUrl}`);
  }

  getOpenCashRegister() {
    return this.http.get(`${this.baseUrl}/open`);
  }

  createCashRegister(registerData: any) {
    return this.http.post(`${this.baseUrl}`, registerData);
  }

  updateCashRegister(id: string, registerData: any) {
    return this.http.put(`${this.baseUrl}/${id}`, registerData);
  }

  // Registrar una venta en la caja actual
  registerSale(amount: number, paymentMethod: string): boolean {
    const savedRegister = localStorage.getItem('currentRegister');
    
    if (!savedRegister) {
      console.warn('No hay una caja abierta para registrar la venta');
      return false;
    }

    const currentRegister: CashRegister = JSON.parse(savedRegister);

    // Crear la transacción
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'venta',
      amount: amount,
      description: 'Venta registrada',
      timestamp: new Date(),
      paymentMethod: paymentMethod
    };

    // Agregar transacción al historial
    currentRegister.transactions.push(transaction);
    
    // Actualizar totales
    currentRegister.totalsales += amount;

    // Normalizar el método de pago
    const normalizedPayment = paymentMethod.trim();
    
    console.log('Método de pago recibido:', paymentMethod);
    console.log('Registrando en salesbymethod');

    // Inicializar salesbymethod si no existe
    if (!currentRegister.salesbymethod) {
      currentRegister.salesbymethod = {};
    }

    // Agregar o actualizar el método de pago dinámicamente
    if (!currentRegister.salesbymethod[normalizedPayment]) {
      currentRegister.salesbymethod[normalizedPayment] = 0;
    }
    currentRegister.salesbymethod[normalizedPayment] += amount;

    console.log('Ventas por método:', currentRegister.salesbymethod);

    // Guardar en localStorage
    localStorage.setItem('currentRegister', JSON.stringify(currentRegister));
    
    return true;
  }

  // Registrar una devolución en la caja actual
  registerReturn(amount: number, description: string, paymentMethod: string = 'Efectivo'): boolean {
    const savedRegister = localStorage.getItem('currentRegister');
    
    if (!savedRegister) {
      console.warn('No hay una caja abierta para registrar la devolución');
      return false;
    }

    const currentRegister: CashRegister = JSON.parse(savedRegister);

    // Crear la transacción de devolución
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'devolucion',
      amount: amount,
      description: description,
      timestamp: new Date(),
      paymentMethod: paymentMethod
    };

    // Agregar transacción al historial
    currentRegister.transactions.push(transaction);
    
    // Actualizar totales (restar de ventas)
    currentRegister.totalsales -= amount;

    // Inicializar salesbymethod si no existe
    if (!currentRegister.salesbymethod) {
      currentRegister.salesbymethod = {};
    }

    // Restar del método de pago correspondiente
    const normalizedPayment = paymentMethod.trim();
    if (currentRegister.salesbymethod[normalizedPayment]) {
      currentRegister.salesbymethod[normalizedPayment] -= amount;
    }

    // Guardar en localStorage
    localStorage.setItem('currentRegister', JSON.stringify(currentRegister));
    
    return true;
  }

  // Obtener la caja actual
  getCurrentRegister(): CashRegister | null {
    const savedRegister = localStorage.getItem('currentRegister');
    return savedRegister ? JSON.parse(savedRegister) : null;
  }

  // Verificar si hay una caja abierta
  isBoxOpen(): boolean {
    return localStorage.getItem('currentRegister') !== null;
  }
}
