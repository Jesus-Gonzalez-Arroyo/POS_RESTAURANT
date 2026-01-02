import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sales } from '../../core/services/sales/sales';
import { PaymenthMethods } from '../../core/services/paymenthMethods/paymenth-methods';
import { PaymentMethod } from '../../core/models/index';
import { Sale } from '../../core/models/index';
import { formatPriceCustom } from '../../shared/utils/formatPrice';
import { generateSaleReceipt, printDocument } from '../../shared/utils/printTemplates';
import { getDate, getHours } from '../../shared/utils/formartDate';

@Component({
  selector: 'app-accounting',
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './accounting.html',
  styleUrl: './accounting.css',
  standalone: true
})
export class Accounting implements OnInit {
  protected Math = Math;
  
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  selectedPaymentMethod: string = '';
  startDate: string = '';
  endDate: string = '';
  sortBy: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  selectedSaleProducts: any[] | null = null;
  paymentMethods: PaymentMethod[] = [];
  uniquePaymentMethods: string[] = []; // Métodos únicos usados en ventas

  constructor(
    private salesService: Sales,
    private paymentMethodsService: PaymenthMethods
  ) {}

  ngOnInit() {
    this.loadPaymentMethods();
    this.loadSales();
  }

  // Cargar métodos de pago desde la base de datos
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

  // Extraer métodos de pago únicos de las ventas
  extractUniquePaymentMethods() {
    const uniqueMethods = new Set<string>();
    this.sales.forEach(sale => {
      if (sale.paymentmethod) {
        uniqueMethods.add(sale.paymentmethod);
      }
    });
    this.uniquePaymentMethods = Array.from(uniqueMethods).sort();
  }

  loadSales() {
    this.loading = true;
    this.error = null;

    this.salesService.getAllSales().subscribe({
      next: (sales) => {
        this.sales = sales;
        this.filteredSales = sales;
        this.totalItems = sales.length;
        this.extractUniquePaymentMethods();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando ventas:', error);
        this.error = 'Error al cargar las ventas';
        this.loading = false;
      }
    });
  }

  // Aplicar filtros y ordenamiento
  applyFilters() {
    let result = [...this.sales];

    // Filtro por término de búsqueda (cliente)
    if (this.searchTerm) {
      result = result.filter(sale => 
        sale.customer.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro por método de pago (comparación exacta sin normalizar)
    if (this.selectedPaymentMethod) {
      result = result.filter(sale => {
        const saleMethod = (sale.paymentmethod || '').trim();
        const selectedMethod = this.selectedPaymentMethod.trim();
        return saleMethod === selectedMethod;
      });
    }

    // Filtro por rango de fechas
    if (this.startDate) {
      const start = new Date(this.startDate);
      result = result.filter(sale => new Date(sale.time) >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(sale => new Date(sale.time) <= end);
    }

    // Ordenamiento
    result.sort((a, b) => {
      let comparison = 0;
      
      switch(this.sortBy) {
        case 'date':
          comparison = new Date(a.time).getTime() - new Date(b.time).getTime();
          break;
        case 'total':
          comparison = parseInt(a.total) - parseInt(b.total);
          break;
        case 'ganancias':
          comparison = parseInt(a.ganancias || '0') - parseInt(b.ganancias || '0');
          break;
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredSales = result;
    this.totalItems = result.length;
    this.currentPage = 1;
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm = '';
    this.selectedPaymentMethod = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  // Cambiar ordenamiento
  changeSortBy(field: string) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
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

  // Formatear precio
  formatPrice(price: any): string {
    return formatPriceCustom(parseInt(price));
  }

  // Obtener el primer producto de la venta (para mostrar en la tabla)
  getFirstProduct(products: any[]): { name: string; quantity: number } {
    if (products && products.length > 0) {
      return {
        name: products[0].name,
        quantity: products[0].quantity
      };
    }
    return { name: 'Sin productos', quantity: 0 };
  }

  // Obtener inicial del nombre del cliente
  getInitial(name: string): string {
    return name ? name[0].toUpperCase() : '?';
  }

  // Mostrar detalles de productos
  showProductDetails(products: any[]) {
    this.selectedSaleProducts = products;
  }

  // Cerrar detalles de productos
  closeProductDetails() {
    this.selectedSaleProducts = null;
  }

  // Obtener total de productos
  getTotalProducts(products: any[]): number {
    return products.reduce((sum, p) => sum + p.quantity, 0);
  }

  // Obtener resumen de estadísticas
  get totalSalesAmount(): number {
    return this.filteredSales.reduce((sum, sale) => sum + parseInt(sale.total), 0);
  }

  get totalProfits(): number {
    const ganancias = this.filteredSales.reduce((sum, sale) => sum + parseInt(sale.ganancias || '0'), 0);
    return ganancias;
  }

  get averageSaleAmount(): number {
    return this.filteredSales.length > 0 ? this.totalSalesAmount / this.filteredSales.length : 0;
  }

  // Imprimir factura
  printSale(sale: Sale) {
    const receiptHtml = generateSaleReceipt(sale);
    printDocument(receiptHtml);
  }

  // Obtener clases CSS para el método de pago
  getPaymentMethodClass(paymentMethod: string): string {    
    const methodLower = paymentMethod.toLowerCase();
    const classGroups: Record<string, string[]> = {
      'bg-gradient-to-r from-green-100 to-green-200 text-green-800': ['efectivo', 'cash'],
      'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800': ['transferencia', 'transfer', 'qr', 'nequi', 'daviplata', 'bancolombia'],
      'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800': ['tarjeta', 'card', 'debito', 'debit'],
      'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800': ['credito', 'credit']
    };

    for (const [cssClass, methods] of Object.entries(classGroups)) {
      if (methods.some(m => methodLower.includes(m))) {
        return cssClass;
      }
    }

    return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
  }

  modifyTime(dateString: string | Date): string {
    return getHours(dateString);
  }
}
