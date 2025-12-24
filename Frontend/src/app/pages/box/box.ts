import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxRegister } from '../../core/services/box/box-register';
import { PaymenthMethods } from '../../core/services/paymenthMethods/paymenth-methods';
import { CashRegister, Transaction, PaymentMethod } from '../../core/models/index';
import { Alert } from '../../shared/utils/alert';

@Component({
  selector: 'app-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './box.html',
  styleUrl: './box.css',
  standalone: true
})
export class Box implements OnInit {
  Math = Math;
  currentRegister: Omit<CashRegister, 'id'> | null = null;
  registerHistory: CashRegister[] = [];
  paymentMethods: PaymentMethod[] = [];
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
  startDate: string = '';
  endDate: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  selectedRegister: CashRegister | null = null;

  constructor(
    private boxRegister: BoxRegister,
    private paymentMethodsService: PaymenthMethods
  ) {}

  ngOnInit() {
    this.loadPaymentMethods();
    this.loadRegisterHistory();
    this.loadCurrentRegister();
    // Recargar la caja cada cierto tiempo para reflejar ventas
    setInterval(() => this.loadCurrentRegister(), 5000);
  }

  // Cargar métodos de pago
  loadPaymentMethods() {
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (methods: any) => {
        this.paymentMethods = methods.filter((m: PaymentMethod) => m.is_active);
      },
      error: (error) => {
        console.error('Error cargando métodos de pago:', error);
      }
    });
  }

  // Cargar caja actual
  loadCurrentRegister() {
    const savedRegister = localStorage.getItem('currentRegister');
    if (savedRegister) {
      this.currentRegister = JSON.parse(savedRegister);
      this.currentRegister!.openingdate = new Date(this.currentRegister!.openingdate);
      // Limpiar devoluciones mal registradas en totalexpenses
      this.cleanupIncorrectReturns();
    }
  }

  // Limpiar devoluciones incorrectamente registradas como gastos
  cleanupIncorrectReturns() {
    if (!this.currentRegister) return;
    
    // Buscar transacciones de tipo 'devolucion' que se hayan sumado incorrectamente a gastos
    const returnTransactions = this.currentRegister.transactions.filter(t => t.type === 'devolucion');
    const totalReturnsAmount = returnTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Si hay devoluciones y gastos mayores o iguales a ese monto, limpiar
    if (returnTransactions.length > 0 && this.currentRegister.totalexpenses >= totalReturnsAmount) {
      console.log(`Limpiando devoluciones incorrectas: $${totalReturnsAmount} de gastos`);
      this.currentRegister.totalexpenses = Math.max(0, this.currentRegister.totalexpenses - totalReturnsAmount);
      localStorage.setItem('currentRegister', JSON.stringify(this.currentRegister));
    }
  }

  // Obtener método de pago de efectivo (el primero que contenga "efectivo" en el nombre)
  get cashPaymentMethod(): string {
    const cashMethod = this.paymentMethods.find(m => 
      m.name.toLowerCase().includes('efectivo') || 
      m.name.toLowerCase().includes('cash')
    );
    return cashMethod ? cashMethod.name : 'Efectivo';
  }

  // Obtener total de ventas en efectivo
  get cashSales(): number {
    if (!this.currentRegister || !this.currentRegister.salesbymethod) return 0;
    return this.currentRegister.salesbymethod[this.cashPaymentMethod] || 0;
  }

  // Abrir modal de cierre (recarga datos primero)
  openCloseModal() {
    this.loadCurrentRegister(); // Recargar datos antes de abrir el modal
    this.showCloseModal = true;
  }

  // Calcular total de devoluciones
  get totalReturns(): number {
    if (!this.currentRegister) return 0;
    return this.currentRegister.transactions
      .filter(t => t.type === 'devolucion')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // Calcular total de gastos/retiros incluyendo devoluciones
  get totalExpensesAndReturns(): number {
    if (!this.currentRegister) return 0;
    return this.currentRegister.totalexpenses + this.totalReturns;
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
      openingdate: new Date(),
      openingamount: this.openingAmount,
      totalsales: 0,
      totalexpenses: 0,
      salesbymethod: {},
      status: 'abierta',
      openedby: localStorage.getItem('user') || 'Usuario actual',
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
      Alert('Error', 'El monto de cierre debe ser positivo', 'error');
      return;
    }

    if (this.closingAmount === 0) {
      Alert('Error', 'El monto de cierre no puede ser cero', 'error');
      return;
    }

    const expectedamount = this.currentRegister.openingamount + 
                          this.cashSales - 
                          this.currentRegister.totalexpenses;

    const difference = this.closingAmount - expectedamount;

    this.currentRegister.closingdate = new Date();
    this.currentRegister.closingamount = this.closingAmount;
    this.currentRegister.expectedamount = expectedamount;
    this.currentRegister.difference = difference;
    this.currentRegister.status = 'cerrada';
    this.currentRegister.closedby = localStorage.getItem('user') || 'Usuario actual';
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
      paymentMethod: this.cashPaymentMethod
    };

    this.currentRegister.transactions.push(transaction);

    if (this.transactionType === 'retiro') {
      this.currentRegister.totalexpenses += this.transactionAmount;
      // Restar del efectivo
      if (!this.currentRegister.salesbymethod[this.cashPaymentMethod]) {
        this.currentRegister.salesbymethod[this.cashPaymentMethod] = 0;
      }
      this.currentRegister.salesbymethod[this.cashPaymentMethod] -= this.transactionAmount;
    } else {
      // Sumar al efectivo
      if (!this.currentRegister.salesbymethod[this.cashPaymentMethod]) {
        this.currentRegister.salesbymethod[this.cashPaymentMethod] = 0;
      }
      this.currentRegister.salesbymethod[this.cashPaymentMethod] += this.transactionAmount;
    }

    localStorage.setItem('currentRegister', JSON.stringify(this.currentRegister));

    this.showTransactionModal = false;
    this.transactionAmount = 0;
    this.transactionDescription = '';
  }

  // Registrar venta (esto se llamaría desde el módulo de ventas)
  registerSale(amount: number, paymentMethod: string) {
    // Usar el servicio para mantener consistencia
    return this.boxRegister.registerSale(amount, paymentMethod);
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

    // Filtro por fecha de apertura
    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(r => new Date(r.openingdate) >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => new Date(r.openingdate) <= end);
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
