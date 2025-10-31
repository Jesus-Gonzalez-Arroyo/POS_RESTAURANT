import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxRegister } from '../../core/services/box/box-register';

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
  paymentMethod?: 'efectivo' | 'tarjeta' | 'transferencia';
}

@Component({
  selector: 'app-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './box.html',
  styleUrl: './box.css',
  standalone: true
})
export class Box implements OnInit {
  Math = Math;
  currentRegister: CashRegister | null = null;
  registerHistory: CashRegister[] = [];
  showOpenModal = false;
  showCloseModal = false;
  showTransactionModal = false;
  showDetailModal = false;
  openingAmount: number = 0;
  closingAmount: number = 0;
  transactionType: 'retiro' | 'ingreso' = 'retiro';
  transactionAmount: number = 0;
  transactionDescription: string = '';
  closingNotes: string = '';
  filterStatus: string = 'todas';
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  selectedRegister: CashRegister | null = null;

  constructor(private boxRegister: BoxRegister) {}

  ngOnInit() {
    this.loadRegisterHistory();
    this.loadCurrentRegister();
  }

  // Cargar caja actual
  loadCurrentRegister() {
    const savedRegister = localStorage.getItem('currentRegister');
    if (savedRegister) {
      this.currentRegister = JSON.parse(savedRegister);
      this.currentRegister!.openingdate = new Date(this.currentRegister!.openingdate);
    }
  }

  // Cargar historial
  loadRegisterHistory() {
    this.boxRegister.getAllCashRegisters().subscribe({
      next: (data: any) => {
        this.registerHistory = data;
      }
    });
  }

  // Abrir caja
  openRegister() {
    if (this.openingAmount < 0) {
      alert('El monto de apertura debe ser positivo');
      return;
    }

    this.currentRegister = {
      id: '',
      openingdate: new Date(),
      openingamount: this.openingAmount,
      totalsales: 0,
      totalexpenses: 0,
      cashsales: 0,
      cardsales: 0,
      transfersales: 0,
      status: 'abierta',
      openedby: 'Usuario Actual',
      transactions: []
    };

    localStorage.setItem('currentRegister', JSON.stringify(this.currentRegister));
    this.showOpenModal = false;
    this.openingAmount = 0;
  }

  // Cerrar caja
  closeRegister() {
    if (!this.currentRegister) return;

    if (this.closingAmount < 0) {
      alert('El monto de cierre debe ser positivo');
      return;
    }

    const expectedamount = this.currentRegister.openingamount + 
                          this.currentRegister.cashsales - 
                          this.currentRegister.totalexpenses;

    const difference = this.closingAmount - expectedamount;

    this.currentRegister.closingdate = new Date();
    this.currentRegister.closingamount = this.closingAmount;
    this.currentRegister.expectedamount = expectedamount;
    this.currentRegister.difference = difference;
    this.currentRegister.status = 'cerrada';
    this.currentRegister.closedby = 'Usuario Actual';
    this.currentRegister.notes = this.closingNotes;

    this.boxRegister.createCashRegister(this.currentRegister).subscribe(
      {
        next: (data: any) => {
          this.loadRegisterHistory();
        }
      }
    );

    // Limpiar caja actual
    localStorage.removeItem('currentRegister');
    this.currentRegister = null;
    
    this.showCloseModal = false;
    this.closingAmount = 0;
    this.closingNotes = '';
  }

  // Agregar transacción manual
  addTransaction() {
    if (!this.currentRegister) return;

    if (this.transactionAmount <= 0) {
      alert('El monto debe ser mayor a cero');
      return;
    }

    const transaction: Transaction = {
      id: '',
      type: this.transactionType,
      amount: this.transactionAmount,
      description: this.transactionDescription,
      timestamp: new Date(),
      paymentMethod: 'efectivo'
    };

    this.currentRegister.transactions.push(transaction);

    if (this.transactionType === 'retiro') {
      this.currentRegister.totalexpenses += this.transactionAmount;
      this.currentRegister.cashsales -= this.transactionAmount;
    } else {
      this.currentRegister.cashsales += this.transactionAmount;
    }

    localStorage.setItem('currentRegister', JSON.stringify(this.currentRegister));

    this.showTransactionModal = false;
    this.transactionAmount = 0;
    this.transactionDescription = '';
  }

  // Registrar venta (esto se llamaría desde el módulo de ventas)
  registerSale(amount: number, paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia') {
    if (!this.currentRegister) return;

    const transaction: Transaction = {
      id: '',
      type: 'venta',
      amount: amount,
      description: 'Venta registrada',
      timestamp: new Date(),
      paymentMethod: paymentMethod
    };

    this.currentRegister.transactions.push(transaction);
    this.currentRegister.totalsales += amount;

    switch(paymentMethod) {
      case 'efectivo':
        this.currentRegister.cashsales  += amount;
        break;
      case 'tarjeta':
        this.currentRegister.cardsales += amount;
        break;
      case 'transferencia':
        this.currentRegister.transfersales += amount;
        break;
    }

    localStorage.setItem('currentRegister', JSON.stringify(this.currentRegister));
  }

  // Ver detalles
  viewDetails(register: CashRegister) {
    this.selectedRegister = register;
    this.showDetailModal = true;
  }

  // Utilidades
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Filtros
  get filteredHistory() {
    let filtered = this.registerHistory;

    if (this.filterStatus !== 'todas') {
      filtered = filtered.filter(r => r.status === this.filterStatus);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(r => 
        r.openedby.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  get paginatedHistory() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredHistory.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredHistory.length / this.itemsPerPage);
  }
}
