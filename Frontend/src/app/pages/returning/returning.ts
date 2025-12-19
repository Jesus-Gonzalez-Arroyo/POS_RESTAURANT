import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sales, Sale } from '../../core/services/sales/sales';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { formatPriceCustom } from '../../shared/utils/formatPrice';
import { Returns } from '../../core/services/returns/returns';

interface SaleWithId extends Sale {
  id: number;
}

interface ReturnProduct {
  id: number;
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
  loading: boolean = true;
  
  // Devoluciones
  allReturns: any[] = [];
  loadingReturns: boolean = false;
  selectedReturn: any = null;
  showReturnModal: boolean = false;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  Math = Math;

  constructor(private salesService: Sales, private returnsService: Returns) { }

  ngOnInit() {
    this.loadSales();
    this.loadReturns();
  }

  loadReturns() {
    this.loadingReturns = true;
    this.returnsService.getAllReturns().subscribe({
      next: (returns: any[]) => {
        this.allReturns = returns;
        this.loadingReturns = false;
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar las devoluciones', 'error');
        console.error('Error al cargar devoluciones:', error);
        this.loadingReturns = false;
      }
    });
  }

  openReturnModal(returnData: any) {
    this.selectedReturn = returnData;
    this.showReturnModal = true;
  }

  closeReturnModal() {
    this.selectedReturn = null;
    this.showReturnModal = false;
  }

  loadSales() {
    this.salesService.getAllSales().subscribe({
      next: (sales: any[]) => {
        this.allSales = sales.map((sale, index) => ({
          ...sale
        }));
        this.filteredSales = [...this.allSales];
        this.totalItems = this.allSales.length;
        this.loading = false;
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
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSales = this.allSales.filter(sale =>
        sale.customer.toLowerCase().includes(term)
      );
    }

    this.totalItems = this.filteredSales.length;
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredSales = [...this.allSales];
    this.totalItems = this.filteredSales.length;
    this.currentPage = 1;
  }

  selectSale(sale: SaleWithId) {
    console.log('Venta seleccionada para devolución:', sale);
    this.selectedSale = sale;
    this.returnProducts = sale.products.map(product => ({
      id: product.id,
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
    if (!this.selectedSale) {
      Alert('Error', 'No hay una venta seleccionada', 'error');
      return;
    }

    const returnData = {
      saleId: this.selectedSale.id,
      customer: this.selectedSale.customer,
      products: this.returnProducts
        .filter(p => p.selected)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.returnQuantity
        })),
      total: this.returnTotal,
      reason: this.returnReason,
    };

    console.log('Datos de devolución a enviar:', returnData);

    this.returnsService.createReturn(returnData).subscribe({
      next: (response) => {
        Alert(
          'Devolución Procesada',
          `Se ha procesado la devolución exitosamente. Total devuelto: $${this.formatPrice(this.returnTotal)}`,
          'success'
        );

        this.cancelReturn();
        this.loadSales();
        this.loadReturns();
      },
      error: (error) => {
        Alert('Error', 'No se pudo procesar la devolución', 'error');
        console.error('Error al procesar devolución:', error);
      }
    });
  }

  formatPrice(price: number | string): string {
    return formatPriceCustom(Number(price));
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota'
    });
  }

  // Obtener ventas paginadas
  get paginatedSales() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSales.slice(startIndex, endIndex);
  }

  // Obtener número total de páginas
  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Obtener array de páginas para la paginación
  get pages() {
    const maxPages = 5;
    const total = this.totalPages;

    if (total <= maxPages) {
      return Array(total).fill(0).map((_, i) => i + 1);
    }

    const current = this.currentPage;
    const pages = [];

    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push(total);
    } else if (current >= total - 2) {
      pages.push(1);
      for (let i = total - 3; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push(total);
    }

    return pages;
  }

  // Navegación de páginas
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Cambiar cantidad de elementos por página
  changeItemsPerPage() {
    this.currentPage = 1;
  }
}
