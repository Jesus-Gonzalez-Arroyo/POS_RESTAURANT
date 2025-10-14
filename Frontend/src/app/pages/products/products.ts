import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from '../../shared/components/modal/modal/modal';
import { ProductsService, Product, CreateProductDto } from '../../core/services/products/products.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, HttpClientModule, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  showModal = false;
  modalTitle = 'Agregar Producto';
  searchTerm = '';
  selectedCategory = 'Todas';
  selectedAvailability = 'Todas';
  loading = false;
  error: string | null = null;

  newProduct = {
    name: '',
    price: null as number | null,
    earnings: null as number | null,
    category: '',
    availability: true
  };  
  
  // Propiedades de paginación
  currentPage = 1;
  itemsPerPage = 5;

  // Propiedades del formulario
  isEditMode = false;
  editingProductId: number | null = null;
  
  allProducts: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;
    
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  // Función alternativa con formato personalizado (punto como separador de miles)
  formatPriceCustom(price: number): string {
    if (price === null || price === undefined) {
      return '0';
    }
    
    // Convierte a string y agrega puntos como separadores de miles
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Obtener categorías únicas
  get categories() {
    const uniqueCategories = [...new Set(this.allProducts.map(product => product.category))];
    return ['Todas', ...uniqueCategories];
  }

  // Obtener disponibilidades únicas
  get availabilities() {
    const uniqueAvailabilities = [...new Set(this.allProducts.map(product => product.availability ? 'Disponible' : 'No disponible'))];
    return ['Todas', ...uniqueAvailabilities];
  }

  // Obtener productos filtrados (sin paginación)
  get filteredProducts() {
    let filteredProducts = this.allProducts;

    // Filtrar por búsqueda
    if (this.searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (this.selectedCategory !== 'Todas') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === this.selectedCategory
      );
    }

    // Filtrar por disponibilidad
    if (this.selectedAvailability !== 'Todas') {
      const isAvailable = this.selectedAvailability === 'Disponible';
      filteredProducts = filteredProducts.filter(product => 
        product.availability === isAvailable
      );
    }

    return filteredProducts;
  }

  // Obtener productos de la página actual
  get products() {
    const filtered = this.filteredProducts;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  // Calcular total de páginas
  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Obtener array de páginas para el paginador
  get pages() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Información de paginación
  get paginationInfo() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
    return {
      start: startIndex,
      end: endIndex,
      total: this.filteredProducts.length
    };
  }

  deleteProduct(id: number) {
    this.loading = true;
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.allProducts = this.allProducts.filter(product => product.id !== id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error eliminando producto:', error);
        this.error = 'Error al eliminar el producto';
        this.loading = false;
      }
    });
  }

  editProduct(product: Product) {
    const existingProduct = this.allProducts.find(p => p.id === product.id);
    if (existingProduct) {
      this.newProduct = {
        name: existingProduct.name,
        price: existingProduct.price,
        earnings: existingProduct.earnings,
        category: existingProduct.category,
        availability: existingProduct.availability
      };
      
      this.isEditMode = true;
      this.editingProductId = product.id;
      this.modalTitle = 'Editar Producto';
      this.showModal = true;
    }
  }

  showAddProductModal() {
    this.resetForm();
    this.modalTitle = 'Agregar Producto';
    this.showModal = true;
  }

  searchProducts(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Resetear página al buscar
  }

  // Limpiar todos los filtros
  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'Todas';
    this.selectedAvailability = 'Todas';
    this.currentPage = 1; // Resetear página al limpiar filtros
  }

  // Filtrar por categoría
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1; // Resetear página al cambiar filtro
  }

  // Filtrar por disponibilidad
  filterByAvailability(availability: string) {
    this.selectedAvailability = availability;
    this.currentPage = 1; // Resetear página al cambiar filtro
  }

  // Funciones de paginación
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

  changeItemsPerPage(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Resetear a la primera página
  }

  // Funciones del formulario
  saveProduct() {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    if (this.isValidProduct()) {
      this.loading = true;
      const productData: CreateProductDto = {
        name: this.newProduct.name,
        price: Number(this.newProduct.price),
        earnings: Number(this.newProduct.earnings),
        category: this.newProduct.category,
        availability: this.newProduct.availability
      };
      
      this.productsService.createProduct(productData).subscribe({
        next: (response) => {
          console.log('Producto agregado:', response);
          this.loadProducts();
          this.resetForm();
          this.showModal = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error agregando producto:', error);
          this.error = 'Error al agregar el producto';
          this.loading = false;
        }
      });
    }
  }

  updateProduct() {
    if (this.isValidProduct() && this.editingProductId) {
      this.loading = true;
      const productData: CreateProductDto = {
        name: this.newProduct.name,
        price: Number(this.newProduct.price),
        earnings: Number(this.newProduct.earnings),
        category: this.newProduct.category,
        availability: this.newProduct.availability
      };
      
      this.productsService.updateProduct(this.editingProductId, productData).subscribe({
        next: (response) => {
          console.log('Producto actualizado:', response);
          this.loadProducts();
          this.resetForm();
          this.showModal = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error actualizando producto:', error);
          this.error = 'Error al actualizar el producto';
          this.loading = false;
        }
      });
    }
  }

  isValidProduct(): boolean {
    return !!(
      this.newProduct.name?.trim() &&
      this.newProduct.price !== null &&
      this.newProduct.price > 0 &&
      this.newProduct.earnings !== null &&
      this.newProduct.earnings >= 0 &&
      this.newProduct.category?.trim()
    );
  }

  cancelForm() {
    this.resetForm();
    this.showModal = false;
  }

  resetForm() {
    this.newProduct = {
      name: '',
      price: null as number | null,
      earnings: null as number | null,
      category: '',
      availability: true
    };
    this.isEditMode = false;
    this.editingProductId = null;
  }
}
