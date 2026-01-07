import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Category, PaymentMethod } from '../../core/models/settings.interface';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { getDate } from '../../shared/utils/formartDate';
import { PaymenthMethods } from '../../core/services/paymenthMethods/paymenth-methods';
import { Categories as CategoriesService } from '../../core/services/categories/categories';
import { capitalize } from '../../shared/utils/capitalize';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  standalone: true
})
export class Categories implements OnInit {

  constructor(private categoriesService: CategoriesService, private paymentMethodsService: PaymenthMethods) {}
  
  activeTab: 'categories' | 'payments' = 'categories';
  
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  
  showCategoryModal = false;
  showPaymentModal = false;
  editingCategory: Category | null = null;
  editingPayment: PaymentMethod | null = null;
  
  newCategory: Partial<Category> = {
    name: '',
    description: '',
    color: 'bg-blue-500',
    icon: 'fa-pills',
    is_active: true
  };
  
  newPaymentMethod: Partial<PaymentMethod> = {
    name: '',
    description: '',
    color: 'bg-green-500',
    icon: 'fa-money-bill',
    is_active: true
  };
  
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
  
  categoryIcons = [
    { value: 'fa-pills', label: 'Pastillas' },
    { value: 'fa-capsules', label: 'Cápsulas' },
    { value: 'fa-prescription-bottle', label: 'Frasco' },
    { value: 'fa-syringe', label: 'Jeringa' },
    { value: 'fa-thermometer', label: 'Termómetro' },
    { value: 'fa-heartbeat', label: 'Salud' },
    { value: 'fa-stethoscope', label: 'Estetoscopio' },
    { value: 'fa-band-aid', label: 'Curita' },
    { value: 'fa-briefcase-medical', label: 'Botiquín' },
    { value: 'fa-prescription', label: 'Receta' },
    { value: 'fa-mortar-pestle', label: 'Mortero' },
    { value: 'fa-first-aid', label: 'Primeros Auxilios' }
  ];

  paymentIcons = [
    { value: 'fa-money-bill', label: 'Dinero' },
    { value: 'fa-credit-card', label: 'Tarjeta' },
    { value: 'fa-mobile-alt', label: 'Móvil' },
    { value: 'fa-university', label: 'Banco' },
    { value: 'fa-wallet', label: 'Billetera' },
    { value: 'fa-coins', label: 'Monedas' },
    { value: 'fa-dollar-sign', label: 'Dólar' },
    { value: 'fa-qrcode', label: 'QR' },
    { value: 'fa-hand-holding-usd', label: 'Efectivo' },
    { value: 'fa-exchange-alt', label: 'Transferencia' },
    { value: 'fa-cash-register', label: 'Caja' },
    { value: 'fa-receipt', label: 'Recibo' }
  ];

  ngOnInit() {
    this.loadCategories();
    this.loadPaymentMethods();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data as Category[];
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        Alert('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
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
        icon: 'fa-pills',
        is_active: true
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
      const index = this.categories.findIndex(c => c.id === this.editingCategory!.id);
      if (index !== -1) {
        this.categories[index] = {
          ...this.editingCategory,
          ...this.newCategory,
          updatedAt: new Date()
        } as Category;
      }

      this.categoriesService.updateCategory(this.categories[index].id, this.categories[index]).subscribe({
        next: () => {
          Alert('Completado', 'Categoría actualizada exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar categoría:', err);
          Alert('Error', 'No se pudo actualizar la categoría', 'error');
        }
      });
    } else {
      const newCat: Omit<Category, 'id'> = {
        name: this.newCategory.name!,
        description: this.newCategory.description,
        color: this.newCategory.color!,
        icon: this.newCategory.icon!,
        is_active: this.newCategory.is_active!,
        created_at: new Date(),
        updated_at: new Date()
      };

      this.categoriesService.createCategory(newCat).subscribe({
        next: () => {
          Alert('Completado', 'Categoría creada exitosamente', 'success');
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error al crear categoría:', err);
          Alert('Error', 'No se pudo crear la categoría', 'error');
        }
      });
      Alert('Completado', 'Categoría creada exitosamente', 'success');
    }

    this.showCategoryModal = false;
  }

  toggleCategoryStatus(category: Category) {
    category.is_active = !category.is_active;
    category.updated_at = new Date();

    this.categoriesService.toggleCategoryState(category.id, category.is_active, category.updated_at).subscribe({
      next: () => {
        Alert('Completado', `Categoría ${category.is_active ? 'activada' : 'desactivada'}`, 'success');
      },
      error: (err) => {
        console.error('Error al actualizar estado de categoría:', err);
        Alert('Error', 'No se pudo actualizar el estado de la categoría', 'error');
      }
    });
  }

  deleteCategory(id: number) {
    ConfirmAlert({ 
      title: 'Confirmar Eliminación', 
      message: '¿Está seguro de eliminar esta categoría? Esta acción no se puede deshacer.', 
      btnAccept: 'Sí, eliminar' 
    }).then((confirmed) => {
      if (confirmed) {
        this.categoriesService.deleteCategory(id).subscribe({
          next: () => {
            Alert('Completado', 'Categoría eliminada exitosamente', 'success');
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error al eliminar categoría:', err);
            Alert('Error', 'No se pudo eliminar la categoría', 'error');
          }
        });
      }
    });
  }

  loadPaymentMethods() {
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (data) => {
        this.paymentMethods = data as PaymentMethod[];
      },
      error: (err) => {
        console.error('Error al cargar métodos de pago:', err);
        Alert('Error', 'No se pudieron cargar los métodos de pago', 'error');
      }
    });
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
        is_active: true
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
      const index = this.paymentMethods.findIndex(p => p.id === this.editingPayment!.id);
      if (index !== -1) {
        this.paymentMethods[index] = {
          ...this.editingPayment,
          ...this.newPaymentMethod,
          updatedAt: new Date()
        } as PaymentMethod;
      }

      this.paymentMethods[index].name = capitalize(this.paymentMethods[index].name);

      this.paymentMethodsService.updatePaymentMethod(this.paymentMethods[index].id, this.paymentMethods[index]).subscribe({
        next: () => {
          Alert('Completado', 'Método de pago actualizado exitosamente', 'success');
          this.loadPaymentMethods();
        },
        error: (err) => {
          console.error('Error al actualizar método de pago:', err);
          Alert('Error', 'No se pudo actualizar el método de pago', 'error');
        }
      });
    } else {
      const newPayment: Omit<PaymentMethod, 'id'> = {
        name: capitalize(this.newPaymentMethod.name!),
        description: this.newPaymentMethod.description,
        color: this.newPaymentMethod.color!,
        icon: this.newPaymentMethod.icon!,
        is_active: this.newPaymentMethod.is_active!,
        created_at: new Date(),
        updated_at: new Date()
      };

      this.paymentMethodsService.createPaymentMethod(newPayment).subscribe({
        next: () => {
          Alert('Completado', 'Método de pago creado exitosamente', 'success');
          this.loadPaymentMethods();
        },
        error: (err) => {
          console.error('Error al crear método de pago:', err);
          Alert('Error', 'No se pudo crear el método de pago', 'error');
        }
      });
    }

    this.showPaymentModal = false;
  }

  togglePaymentStatus(payment: PaymentMethod) {
    payment.is_active = !payment.is_active;
    payment.updated_at = new Date();
    this.paymentMethodsService.togglePaymentMethodState(payment.id, payment.is_active, payment.updated_at).subscribe({
      next: () => {
        Alert('Completado', `Método de pago ${payment.is_active ? 'activado' : 'desactivado'}`, 'success');
      },
      error: (err) => {
        console.error('Error al actualizar estado de método de pago:', err);
        Alert('Error', 'No se pudo actualizar el estado del método de pago', 'error');
      }
    });
  }

  deletePaymentMethod(id: number) {
    ConfirmAlert({ 
      title: 'Confirmar Eliminación', 
      message: '¿Está seguro de eliminar este método de pago? Esta acción no se puede deshacer.', 
      btnAccept: 'Sí, eliminar' 
    }).then((confirmed) => {
      if (confirmed) {
        this.paymentMethodsService.deletePaymentMethod(id).subscribe({
          next: () => {
            Alert('Completado', 'Método de pago eliminado exitosamente', 'success');
            this.loadPaymentMethods();
          },
          error: (err) => {
            console.error('Error al eliminar método de pago:', err);
            Alert('Error', 'No se pudo eliminar el método de pago', 'error');
          }
        });
      }
    });
  }

  formatDate(date: Date): string {
    return getDate(date);
  }
}
