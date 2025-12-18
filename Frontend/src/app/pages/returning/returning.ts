import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sales, Sale } from '../../core/services/sales/sales';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { formatPriceCustom } from '../../shared/utils/formatPrice';

interface SaleWithId extends Sale {
  id: number;
}

interface ReturnProduct {
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  returnQuantity: number;
}

@Component({
  selector: 'app-returning',
  imports: [CommonModule, FormsModule],
  templateUrl: './returning.html',
  styleUrl: './returning.css',
  standalone: true
})
export class Returning implements OnInit {
  allSales: SaleWithId[] = [];
  filteredSales: SaleWithId[] = [];
  selectedSale: SaleWithId | null = null;
  returnProducts: ReturnProduct[] = [];
  returnReason: string = '';
  searchTerm: string = '';

  constructor(private salesService: Sales) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.salesService.getAllSales().subscribe({
      next: (sales: any[]) => {
        // Agregar ID temporal basado en el índice
        this.allSales = sales.map((sale, index) => ({
          ...sale,
          id: index + 1
        }));
        this.filteredSales = [...this.allSales];
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar las ventas', 'error');
        console.error('Error al cargar ventas:', error);
      }
    });
  }

  filterSales() {
    if (!this.searchTerm.trim()) {
      this.filteredSales = [...this.allSales];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredSales = this.allSales.filter(sale => 
      sale.customer.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredSales = [...this.allSales];
  }

  selectSale(sale: SaleWithId) {
    this.selectedSale = sale;
    this.returnProducts = sale.products.map(product => ({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      selected: false,
      returnQuantity: 1
    }));
    this.returnReason = '';
  }

  cancelReturn() {
    this.selectedSale = null;
    this.returnProducts = [];
    this.returnReason = '';
  }

  get selectedProductsCount(): number {
    return this.returnProducts.filter(p => p.selected).length;
  }

  get returnTotal(): number {
    return this.returnProducts
      .filter(p => p.selected)
      .reduce((total, product) => total + (product.price * product.returnQuantity), 0);
  }

  get canProcessReturn(): boolean {
    return this.selectedProductsCount > 0 && 
           this.returnReason.trim().length > 0 &&
           this.returnProducts.every(p => !p.selected || (p.returnQuantity > 0 && p.returnQuantity <= p.quantity));
  }

  processReturn() {
    if (!this.canProcessReturn) {
      Alert('Validación', 'Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    const selectedProducts = this.returnProducts
      .filter(p => p.selected)
      .map(p => `${p.name} (${p.returnQuantity} unidades)`);

    ConfirmAlert({
      title: 'Confirmar Devolución',
      message: `¿Está seguro de procesar la devolución de ${this.selectedProductsCount} producto(s) por un total de $${this.formatPrice(this.returnTotal)}?`,
      icon: 'warning',
      btnAccept: 'Sí, procesar',
      btnCancel: 'Cancelar'
    }).then((result) => {
      if (result) {
        this.confirmReturn();
      }
    });
  }

  confirmReturn() {
    // Aquí se implementaría la lógica para:
    // 1. Registrar la devolución en la base de datos
    // 2. Actualizar el stock de los productos
    // 3. Procesar el reembolso si es necesario
    
    const returnData = {
      saleId: this.selectedSale?.id,
      customer: this.selectedSale?.customer,
      products: this.returnProducts
        .filter(p => p.selected)
        .map(p => ({
          name: p.name,
          price: p.price,
          quantity: p.returnQuantity
        })),
      total: this.returnTotal,
      reason: this.returnReason,
      date: new Date()
    };

    console.log('Datos de devolución:', returnData);

    // Simulación de guardado exitoso
    Alert(
      'Devolución Procesada', 
      `Se ha procesado la devolución exitosamente. Total devuelto: $${this.formatPrice(this.returnTotal)}`,
      'success'
    );

    this.cancelReturn();
    this.loadSales();
  }

  formatPrice(price: number | string): string {
    return formatPriceCustom(Number(price));
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
