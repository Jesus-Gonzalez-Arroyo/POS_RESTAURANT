import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Category, PaymentMethod } from '../../core/models/settings.interface';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  standalone: true
})
export class Categories implements OnInit {
  
  // Estado de la interfaz
  activeTab: 'categories' | 'payments' = 'categories';
  
  // Datos
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  
  // Estado de modales
  showCategoryModal = false;
  showPaymentModal = false;
  editingCategory: Category | null = null;
  editingPayment: PaymentMethod | null = null;
  
  // Formularios
  newCategory: Partial<Category> = {
    name: '',
    description: '',
    color: 'bg-blue-500',
    icon: 'fa-tag',
    isActive: true
  };
  
  newPaymentMethod: Partial<PaymentMethod> = {
    name: '',
    description: '',
    color: 'bg-green-500',
    icon: 'fa-money-bill',
    isActive: true
  };
  
  // Opciones para seleccionar
  availableColors = [
    { value: 'bg-blue-500', label: 'Azul', class: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Verde', class: 'bg-green-500' },
    { value: 'bg-red-500', label: 'Rojo', class: 'bg-red-500' },
    { value: 'bg-yellow-500', label: 'Amarillo', class: 'bg-yellow-500' },
    { value: 'bg-purple-500', label: 'Morado', class: 'bg-purple-500' },
    { value: 'bg-pink-500', label: 'Rosa', class: 'bg-pink-500' },
    { value: 'bg-indigo-500', label: 'Índigo', class: 'bg-indigo-500' },
    { value: 'bg-gray-500', label: 'Gris', class: 'bg-gray-500' }
  ];
  
  availableIcons = [
    { value: 'fa-tag', label: 'Etiqueta' },
    { value: 'fa-coffee', label: 'Café' },
    { value: 'fa-utensils', label: 'Cubiertos' },
    { value: 'fa-hamburger', label: 'Hamburguesa' },
    { value: 'fa-pizza-slice', label: 'Pizza' },
    { value: 'fa-cookie-bite', label: 'Galleta' },
    { value: 'fa-ice-cream', label: 'Helado' },
    { value: 'fa-wine-glass', label: 'Bebida' },
    { value: 'fa-money-bill', label: 'Dinero' },
    { value: 'fa-credit-card', label: 'Tarjeta' },
    { value: 'fa-mobile-alt', label: 'Móvil' },
    { value: 'fa-university', label: 'Banco' }
  ];

  ngOnInit() {
    this.loadCategories();
    this.loadPaymentMethods();
  }

  // CATEGORÍAS
  loadCategories() {
    // TODO: Cargar desde el backend
    this.categories = [
      {
        id: 1,
        name: 'Bebidas',
        description: 'Refrescos, jugos y bebidas calientes',
        color: 'bg-blue-500',
        icon: 'fa-wine-glass',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        id: 2,
        name: 'Comidas',
        description: 'Platos principales y acompañamientos',
        color: 'bg-green-500',
        icon: 'fa-utensils',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        id: 3,
        name: 'Postres',
        description: 'Dulces y postres variados',
        color: 'bg-pink-500',
        icon: 'fa-ice-cream',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      }
    ];
  }

  openCategoryModal(category?: Category) {
    if (category) {
      this.editingCategory = category;
      this.newCategory = { ...category };
    } else {
      this.editingCategory = null;
      this.newCategory = {
        name: '',
        description: '',
        color: 'bg-blue-500',
        icon: 'fa-tag',
        isActive: true
      };
    }
    this.showCategoryModal = true;
  }

  saveCategory() {
    if (!this.newCategory.name?.trim()) {
      Alert('Datos incompletos', 'El nombre de la categoría es obligatorio', 'error');
      return;
    }

    if (this.editingCategory) {
      // Editar categoría existente
      const index = this.categories.findIndex(c => c.id === this.editingCategory!.id);
      if (index !== -1) {
        this.categories[index] = {
          ...this.editingCategory,
          ...this.newCategory,
          updatedAt: new Date()
        } as Category;
      }
      Alert('Completado', 'Categoría actualizada exitosamente', 'success');
    } else {
      // Crear nueva categoría
      const newCat: Category = {
        id: this.categories.length + 1,
        name: this.newCategory.name!,
        description: this.newCategory.description,
        color: this.newCategory.color!,
        icon: this.newCategory.icon!,
        isActive: this.newCategory.isActive!,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.categories.push(newCat);
      Alert('Completado', 'Categoría creada exitosamente', 'success');
    }

    this.showCategoryModal = false;
  }

  toggleCategoryStatus(category: Category) {
    category.isActive = !category.isActive;
    category.updatedAt = new Date();
    Alert('Completado', `Categoría ${category.isActive ? 'activada' : 'desactivada'}`, 'success');
  }

  deleteCategory(id: number) {
    ConfirmAlert({ 
      title: 'Confirmar Eliminación', 
      message: '¿Está seguro de eliminar esta categoría? Esta acción no se puede deshacer.', 
      btnAccept: 'Sí, eliminar' 
    }).then((confirmed) => {
      if (confirmed) {
        this.categories = this.categories.filter(c => c.id !== id);
        Alert('Completado', 'Categoría eliminada exitosamente', 'success');
      }
    });
  }

  // MÉTODOS DE PAGO
  loadPaymentMethods() {
    // TODO: Cargar desde el backend
    this.paymentMethods = [
      {
        id: 1,
        name: 'Efectivo',
        description: 'Pago en efectivo',
        color: 'bg-green-500',
        icon: 'fa-money-bill',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        id: 2,
        name: 'Tarjeta',
        description: 'Pago con tarjeta de crédito o débito',
        color: 'bg-blue-500',
        icon: 'fa-credit-card',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        id: 3,
        name: 'Transferencia',
        description: 'Transferencia bancaria o digital',
        color: 'bg-purple-500',
        icon: 'fa-university',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      }
    ];
  }

  openPaymentModal(payment?: PaymentMethod) {
    if (payment) {
      this.editingPayment = payment;
      this.newPaymentMethod = { ...payment };
    } else {
      this.editingPayment = null;
      this.newPaymentMethod = {
        name: '',
        description: '',
        color: 'bg-green-500',
        icon: 'fa-money-bill',
        isActive: true
      };
    }
    this.showPaymentModal = true;
  }

  savePaymentMethod() {
    if (!this.newPaymentMethod.name?.trim()) {
      Alert('Datos incompletos', 'El nombre del método de pago es obligatorio', 'error');
      return;
    }

    if (this.editingPayment) {
      // Editar método existente
      const index = this.paymentMethods.findIndex(p => p.id === this.editingPayment!.id);
      if (index !== -1) {
        this.paymentMethods[index] = {
          ...this.editingPayment,
          ...this.newPaymentMethod,
          updatedAt: new Date()
        } as PaymentMethod;
      }
      Alert('Completado', 'Método de pago actualizado exitosamente', 'success');
    } else {
      // Crear nuevo método
      const newPayment: Omit<PaymentMethod, 'id'> = {
        name: this.newPaymentMethod.name!,
        description: this.newPaymentMethod.description,
        color: this.newPaymentMethod.color!,
        icon: this.newPaymentMethod.icon!,
        isActive: this.newPaymentMethod.isActive!,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      Alert('Completado', 'Método de pago creado exitosamente', 'success');
    }

    this.showPaymentModal = false;
  }

  togglePaymentStatus(payment: PaymentMethod) {
    payment.isActive = !payment.isActive;
    payment.updatedAt = new Date();
    Alert('Completado', `Método de pago ${payment.isActive ? 'activado' : 'desactivado'}`, 'success');
  }

  deletePaymentMethod(id: number) {
    ConfirmAlert({ 
      title: 'Confirmar Eliminación', 
      message: '¿Está seguro de eliminar este método de pago? Esta acción no se puede deshacer.', 
      btnAccept: 'Sí, eliminar' 
    }).then((confirmed) => {
      if (confirmed) {
        this.paymentMethods = this.paymentMethods.filter(p => p.id !== id);
        Alert('Completado', 'Método de pago eliminado exitosamente', 'success');
      }
    });
  }

  // Utilidades
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
