import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: 'servicios' | 'empleados' | 'proveedores';
  date: Date;
  notes?: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  createdBy: string;
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
    paymentMethod: 'efectivo',
    createdBy: 'Usuario Actual'
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

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    // TODO: Cargar desde el backend
    // Datos de ejemplo
    this.expenses = [
      {
        id: 1,
        description: 'Pago de electricidad',
        amount: 150000,
        category: 'servicios',
        date: new Date('2025-11-01'),
        notes: 'Factura mensual',
        paymentMethod: 'transferencia',
        createdBy: 'Admin'
      },
      {
        id: 2,
        description: 'Salario empleado - Juan Pérez',
        amount: 1200000,
        category: 'empleados',
        date: new Date('2025-11-02'),
        paymentMethod: 'transferencia',
        createdBy: 'Admin'
      },
      {
        id: 3,
        description: 'Compra de insumos',
        amount: 350000,
        category: 'proveedores',
        date: new Date('2025-11-03'),
        notes: 'Proveedor XYZ - Productos varios',
        paymentMethod: 'efectivo',
        createdBy: 'Admin'
      }
    ];
  }

  openAddModal() {
    this.newExpense = {
      description: '',
      amount: 0,
      category: 'servicios',
      date: new Date(),
      notes: '',
      paymentMethod: 'efectivo',
      createdBy: 'Usuario Actual'
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
      paymentMethod: this.newExpense.paymentMethod!,
      createdBy: this.newExpense.createdBy!
    };

    this.expenses.unshift(expense);
    
    // TODO: Guardar en backend
    
    this.showAddModal = false;
    Alert('Completado', 'Gasto registrado exitosamente', 'success');
  }

  viewDetails(expense: Expense) {
    this.selectedExpense = expense;
    this.showDetailModal = true;
  }

  deleteExpense(id: number) {
    ConfirmAlert({ title: 'Confirmar Eliminación', message: '¿Está seguro de eliminar este gasto?', btnAccept: 'Si, eliminar' }).then((confirmed) => {
      if (confirmed) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        // TODO: Eliminar del backend
        Alert('Completado', 'Gasto eliminado exitosamente', 'success');
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
      filtered = filtered.filter(e => e.paymentMethod === this.filterPaymentMethod);
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

