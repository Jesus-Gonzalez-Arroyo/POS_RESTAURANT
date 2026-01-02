import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sales } from '../../core/services/sales/sales';
import { Sale } from '../../core/models';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { formatPriceCustom } from '../../shared/utils/formatPrice';
import { Returns } from '../../core/services/returns/returns';
import { BoxRegister } from '../../core/services/box/box-register';
import { idText } from 'typescript';

interface SaleWithId extends Sale {
  id: number;
}

interface ReturnProduct {
  id: number;
  id_product: number;
  name: string;
  price: number;
  price_sales: number;
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

  // Paginación para Ventas
  salesCurrentPage = 1;
  salesItemsPerPage = 5;
  salesTotalItems = 0;

  // Paginación para Devoluciones
  returnsCurrentPage = 1;
  returnsItemsPerPage = 5;
  returnsTotalItems = 0;

  Math = Math;

  constructor(
    private salesService: Sales, 
    private returnsService: Returns,
    private boxService: BoxRegister
  ) { }

  ngOnInit() {
    this.loadSales();
    this.loadReturns();
  }

  loadReturns() {
    this.loadingReturns = true;
    this.returnsService.getAllReturns().subscribe({
      next: (returns: any[]) => {
        console.log('Devoluciones cargadas:', returns);
        this.allReturns = returns.map(ret => ({
          ...ret,
          products: typeof ret.products === 'string' ? JSON.parse(ret.products) : ret.products
        }));
        this.returnsTotalItems = this.allReturns.length;
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
          ...sale,
          products: typeof sale.products === 'string' ? JSON.parse(sale.products) : sale.products
        }));
        this.filteredSales = [...this.allSales];
        this.salesTotalItems = this.allSales.length;
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

    this.salesTotalItems = this.filteredSales.length;
    this.salesCurrentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredSales = [...this.allSales];
    this.salesTotalItems = this.filteredSales.length;
    this.salesCurrentPage = 1;
  }

  selectSale(sale: SaleWithId) {
    this.selectedSale = sale;

    const products = typeof sale.products === 'string' ? JSON.parse(sale.products) : sale.products;

    this.returnProducts = products.map((product: any) => ({
      id: product.id,
      id_product: product.id_product,
      name: product.name,
      price: Number(product.price) || 0,
      price_sales: Number(product.price_sales) || 0,
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
      .reduce((total, product) => total + (product.price_sales * product.returnQuantity), 0);
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
          id_product: p.id_product,
          name: p.name,
          price: p.price,
          price_sales: p.price_sales,
          quantity: p.returnQuantity
        })),
      total: this.returnTotal,
      reason: this.returnReason,
    };

    this.returnsService.createReturn(returnData).subscribe({
      next: (response) => {
        // Registrar devolución en la caja local si está abierta
        if (this.boxService.isBoxOpen()) {
          this.boxService.registerReturn(
            this.returnTotal, 
            `Devolución de venta #${this.selectedSale!.id} - ${this.returnReason}`
          );
        }

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
    const startIndex = (this.salesCurrentPage - 1) * this.salesItemsPerPage;
    const endIndex = startIndex + this.salesItemsPerPage;
    return this.filteredSales.slice(startIndex, endIndex);
  }

  // Obtener devoluciones paginadas
  get paginatedReturns() {
    const startIndex = (this.returnsCurrentPage - 1) * this.returnsItemsPerPage;
    const endIndex = startIndex + this.returnsItemsPerPage;
    return this.allReturns.slice(startIndex, endIndex);
  }

  // Obtener número total de páginas para ventas
  get salesTotalPages() {
    return Math.ceil(this.salesTotalItems / this.salesItemsPerPage);
  }

  // Obtener número total de páginas para devoluciones
  get returnsTotalPages() {
    return Math.ceil(this.returnsTotalItems / this.returnsItemsPerPage);
  }

  // Navegación de páginas - Ventas
  salesPreviousPage() {
    if (this.salesCurrentPage > 1) {
      this.salesCurrentPage--;
    }
  }

  salesNextPage() {
    if (this.salesCurrentPage < this.salesTotalPages) {
      this.salesCurrentPage++;
    }
  }

  changeSalesItemsPerPage() {
    this.salesCurrentPage = 1;
  }

  // Navegación de páginas - Devoluciones
  returnsPreviousPage() {
    if (this.returnsCurrentPage > 1) {
      this.returnsCurrentPage--;
    }
  }

  returnsNextPage() {
    if (this.returnsCurrentPage < this.returnsTotalPages) {
      this.returnsCurrentPage++;
    }
  }

  changeReturnsItemsPerPage() {
    this.returnsCurrentPage = 1;
  }
}
