import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../shared/components/modal/modal/modal';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  showModal = false;
  modalTitle = 'Agregar Producto';
  searchTerm = '';
  selectedCategory = 'Todas';
  selectedAvailability = 'Todas';

  newProduct = {
    name: '',
    price: null as number | null,
    profit: null as number | null,
    category: '',
    availability: ''
  };  
  // Propiedades de paginación
  currentPage = 1;
  itemsPerPage = 5;

  // Propiedades del formulario
  isEditMode = false;
  editingProductId: number | null = null;
  
  allProducts = [
    { id: 1, name: 'Product 1', price: 100, profit: 50, category: 'Category 1', availability: 'In Stock' },
    { id: 2, name: 'Product 2', price: 200, profit: 80, category: 'Category 2', availability: 'Out of Stock' },
    { id: 3, name: 'Product 3', price: 300, profit: 120, category: 'Category 1', availability: 'In Stock' },
    { id: 4, name: 'Product 4', price: 400, profit: 150, category: 'Category 3', availability: 'In Stock' },
    { id: 5, name: 'Product 5', price: 500, profit: 200, category: 'Category 2', availability: 'Out of Stock' },
    { id: 1, name: 'Product 1', price: 100, profit: 50, category: 'Category 1', availability: 'In Stock' },
    { id: 2, name: 'Product 2', price: 200, profit: 80, category: 'Category 2', availability: 'Out of Stock' },
    { id: 3, name: 'Product 3', price: 300, profit: 120, category: 'Category 1', availability: 'In Stock' },
    { id: 4, name: 'Product 4', price: 400, profit: 150, category: 'Category 3', availability: 'In Stock' },
    { id: 5, name: 'Product 5', price: 500, profit: 200, category: 'Category 2', availability: 'Out of Stock' },
    { id: 1, name: 'Product 1', price: 100, profit: 50, category: 'Category 1', availability: 'In Stock' },
    { id: 2, name: 'Product 2', price: 200, profit: 80, category: 'Category 2', availability: 'Out of Stock' },
    { id: 3, name: 'Product 3', price: 300, profit: 120, category: 'Category 1', availability: 'In Stock' },
    { id: 4, name: 'Product 4', price: 400, profit: 150, category: 'Category 3', availability: 'In Stock' },
    { id: 5, name: 'Product 5', price: 500, profit: 200, category: 'Category 2', availability: 'Out of Stock' },
    { id: 1, name: 'Product 1', price: 100, profit: 50, category: 'Category 1', availability: 'In Stock' },
    { id: 2, name: 'Product 2', price: 200, profit: 80, category: 'Category 2', availability: 'Out of Stock' },
    { id: 3, name: 'Product 3', price: 300, profit: 120, category: 'Category 1', availability: 'In Stock' },
    { id: 4, name: 'Product 4', price: 400, profit: 150, category: 'Category 3', availability: 'In Stock' },
    { id: 5, name: 'Product 5', price: 500, profit: 200, category: 'Category 2', availability: 'Out of Stock' }
  ];

  // Obtener categorías únicas
  get categories() {
    const uniqueCategories = [...new Set(this.allProducts.map(product => product.category))];
    return ['Todas', ...uniqueCategories];
  }

  // Obtener disponibilidades únicas
  get availabilities() {
    const uniqueAvailabilities = [...new Set(this.allProducts.map(product => product.availability))];
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
      filteredProducts = filteredProducts.filter(product => 
        product.availability === this.selectedAvailability
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
    this.allProducts = this.allProducts.filter(product => product.id !== id);
  }

  editProduct(product: { id: number; name: string; price: number; profit: number; category: string; availability: string }) {
    const existingProduct = this.allProducts.find(p => p.id === product.id);
    if (existingProduct) {
      this.newProduct = {
        name: existingProduct.name,
        price: existingProduct.price,
        profit: existingProduct.profit,
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
      const newId = Math.max(...this.allProducts.map(p => p.id)) + 1;
      const productToAdd = {
        id: newId,
        name: this.newProduct.name,
        price: Number(this.newProduct.price),
        profit: Number(this.newProduct.profit),
        category: this.newProduct.category,
        availability: this.newProduct.availability
      };
      
      this.allProducts.push(productToAdd);
      this.resetForm();
      this.showModal = false;
      console.log('Producto agregado:', productToAdd);
    }
  }

  updateProduct() {
    if (this.isValidProduct() && this.editingProductId) {
      const index = this.allProducts.findIndex(p => p.id === this.editingProductId);
      if (index !== -1) {
        this.allProducts[index] = {
          ...this.allProducts[index],
          name: this.newProduct.name,
          price: Number(this.newProduct.price),
          profit: Number(this.newProduct.profit),
          category: this.newProduct.category,
          availability: this.newProduct.availability
        };
        
        this.resetForm();
        this.showModal = false;
        console.log('Producto actualizado');
      }
    }
  }

  isValidProduct(): boolean {
    return !!(
      this.newProduct.name?.trim() &&
      this.newProduct.price !== null &&
      this.newProduct.price > 0 &&
      this.newProduct.profit !== null &&
      this.newProduct.profit >= 0 &&
      this.newProduct.category?.trim() &&
      this.newProduct.availability?.trim()
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
      profit: null as number | null,
      category: '',
      availability: ''
    };
    this.isEditMode = false;
    this.editingProductId = null;
  }
}
