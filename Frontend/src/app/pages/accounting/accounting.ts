import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sales, Sale } from '../../core/services/sales/sales';
import { formatPriceCustom } from '../../shared/utils/formatPrice';

@Component({
  selector: 'app-accounting',
  imports: [CommonModule, DatePipe],
  templateUrl: './accounting.html',
  styleUrl: './accounting.css',
  standalone: true
})
export class Accounting implements OnInit {
  // Hacer Math disponible en el template
  protected Math = Math;
  
  // Lista de ventas
  sales: Sale[] = [];
  
  // Variables de paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Variables de carga y error
  loading = false;
  error: string | null = null;

  constructor(private salesService: Sales) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;
    this.error = null;

    this.salesService.getAllSales().subscribe({
      next: (sales) => {
        this.sales = sales;
        this.totalItems = sales.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando ventas:', error);
        this.error = 'Error al cargar las ventas';
        this.loading = false;
      }
    });
  }

  // Obtener ventas paginadas
  get paginatedSales() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.sales.slice(startIndex, endIndex);
  }

  // Obtener número total de páginas
  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Obtener array de páginas para la paginación
  get pages() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
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

  // Formatear precio
  formatPrice(price: number): string {
    return formatPriceCustom(price);
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

  // Exportar ventas
  exportSales() {
    // Implementar lógica de exportación aquí
    console.log('Exportando ventas...');
  }
}
