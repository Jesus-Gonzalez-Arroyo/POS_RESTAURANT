import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { Bill } from '../../core/services/bill/bill';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: 'servicios' | 'empleados' | 'proveedores';
  date: Date;
  notes?: string;
  paymentmethod: 'efectivo' | 'tarjeta' | 'transferencia';
  createdby: string;
}

@Component({
  selector: 'app-bills',
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.html',
  styleUrl: './bills.css',
  standalone: true
})
export class Bills implements OnInit {
  Math = Math;
  
  expenses: Expense[] = [];
  showAddModal = false;
  showDetailModal = false;
  selectedExpense: Expense | null = null;
  
  // Formulario
  newExpense: Partial<Expense> = {
    description: '',
    amount: 0,
    category: 'servicios',
    date: new Date(),
    notes: '',
    paymentmethod: 'efectivo',
    createdby: 'Usuario Actual'
  };
  
  // Filtros
  searchTerm: string = '';
  filterCategory: string = 'todas';
  filterPaymentMethod: string = 'todos';
  startDate: string = '';
  endDate: string = '';
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  
  // Ordenamiento
  sortBy: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  categories = [
    { value: 'servicios', label: 'Servicios', color: 'bg-blue-100 text-blue-800', icon: 'wrench' },
    { value: 'empleados', label: 'Empleados', color: 'bg-green-100 text-green-800', icon: 'users' },
    { value: 'proveedores', label: 'Proveedores', color: 'bg-purple-100 text-purple-800', icon: 'truck' }
  ];
  
  paymentMethods = ['efectivo', 'tarjeta', 'transferencia'];

  constructor(private billService: Bill) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.billService.getBills().subscribe({
      next: (data: any) => {
        this.expenses = data;
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar los gastos', 'error');
        console.error('Error al cargar los gastos', error);
      }
    });
  }

  openAddModal() {
    this.newExpense = {
      description: '',
      amount: 0,
      category: 'servicios',
      date: new Date(),
      notes: '',
      paymentmethod: 'efectivo',
      createdby: 'Usuario Actual'
    };
    this.showAddModal = true;
  }

  saveExpense() {
    if (!this.newExpense.description || !this.newExpense.amount || this.newExpense.amount <= 0) {
      Alert('Datos incompletos','Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    const expense: Expense = {
      id: this.expenses.length + 1,
      description: this.newExpense.description!,
      amount: this.newExpense.amount!,
      category: this.newExpense.category!,
      date: this.newExpense.date!,
      notes: this.newExpense.notes,
      paymentmethod: this.newExpense.paymentmethod!,
      createdby: this.newExpense.createdby!
    };

    this.billService.addBill(expense).subscribe({
      next: (data: any) => {
        Alert('Completado', 'Gasto registrado exitosamente', 'success');
        this.loadExpenses();
      },
      error: (error) => {
        Alert('Error', 'No se pudo registrar el gasto, Intentelo nuevamente', 'error');
        console.error('Error al registrar el gasto', error);
      }
    });

    this.showAddModal = false;
  }

  viewDetails(expense: Expense) {
    this.selectedExpense = expense;
    this.showDetailModal = true;
  }

  deleteExpense(id: number) {
    ConfirmAlert({ title: 'Confirmar Eliminación', message: '¿Está seguro de eliminar este gasto?', btnAccept: 'Si, eliminar' }).then((confirmed) => {
      if (confirmed) {
        this.billService.deleteBill(id).subscribe({
          next: () => {
            Alert('Completado', 'Gasto eliminado exitosamente', 'success');
            this.loadExpenses();
          },
          error: (error) => {
            Alert('Error', 'No se pudo eliminar el gasto', 'error');
            console.error('Error al eliminar el gasto', error);
          }
        });
      }
    });
  }

  // Filtros
  get filteredExpenses() {
    let filtered = this.expenses;

    if (this.searchTerm) {
      filtered = filtered.filter(e => 
        e.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        e.notes?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterCategory !== 'todas') {
      filtered = filtered.filter(e => e.category === this.filterCategory);
    }

    if (this.filterPaymentMethod !== 'todos') {
      filtered = filtered.filter(e => e.paymentmethod === this.filterPaymentMethod);
    }

    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(e => new Date(e.date) >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.date) <= end);
    }

    // Ordenamiento
    return this.sortExpenses(filtered);
  }

  sortExpenses(expenses: Expense[]) {
    return expenses.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        default:
          comparison = 0;
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  changeSortBy(field: string) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
  }

  get paginatedExpenses() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredExpenses.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredExpenses.length / this.itemsPerPage);
  }

  get totalExpenses() {
    return this.filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }

  get expensesByCategory() {
    return {
      servicios: this.filteredExpenses.filter(e => e.category === 'servicios').reduce((sum, e) => sum + e.amount, 0),
      empleados: this.filteredExpenses.filter(e => e.category === 'empleados').reduce((sum, e) => sum + e.amount, 0),
      proveedores: this.filteredExpenses.filter(e => e.category === 'proveedores').reduce((sum, e) => sum + e.amount, 0)
    };
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterCategory = 'todas';
    this.filterPaymentMethod = 'todos';
    this.startDate = '';
    this.endDate = '';
    this.currentPage = 1;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getCategoryInfo(category: string) {
    return this.categories.find(c => c.value === category);
  }
}

