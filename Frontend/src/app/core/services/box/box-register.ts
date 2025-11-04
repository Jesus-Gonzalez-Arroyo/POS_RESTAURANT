import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface CashRegister {
  id: string;
  openingdate: Date;
  closingdate?: Date;
  openingamount: number;
  closingamount?: number;
  expectedamount?: number;
  difference?: number;
  totalsales: number;
  totalexpenses: number;
  cashsales: number;
  cardsales: number;
  transfersales: number;
  status: 'abierta' | 'cerrada';
  openedby: string;
  closedby?: string;
  transactions: Transaction[];
  notes?: string;
}

interface Transaction {
  id: string;
  type: 'venta' | 'gasto' | 'retiro' | 'ingreso';
  amount: number;
  description: string;
  timestamp: Date;
  paymentMethod?: string;
}

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

    switch(paymentMethod.toLowerCase()) {
      case 'efectivo':
        currentRegister.cashsales += amount;
        break;
      case 'tarjeta':
        currentRegister.cardsales += amount;
        break;
      case 'transferencia':
        currentRegister.transfersales += amount;
        break;
      default:
        currentRegister.cashsales += amount; // Por defecto efectivo
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
