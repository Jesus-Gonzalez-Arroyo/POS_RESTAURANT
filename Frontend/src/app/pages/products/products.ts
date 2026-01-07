import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from '../../shared/components/modal/modal/modal';
import { ProductsService } from '../../core/services/products/products.service';
import { Category, Product } from '../../core/models/index';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { Categories } from '../../core/services/categories/categories';

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
  selectedStay = 'Todas';
  loading = false;
  error: string | null = null;
  categoriesList: Category[] = [];

  newProduct = {
    id_product: '',
    name: '',
    price: null as number | null,
    price_sales: null as number | null,
    earnings: null as number | null,
    category: '',
    availability: true,
    stock: 0,
    stay: '',
    img: null as File | null
  };

  formErrors = {
    id_product: '',
    name: '',
    price: '',
    price_sales: '',
    category: '',
    stock: ''
  };

  formTouched = {
    id_product: false,
    name: false,
    price: false,
    price_sales: false,
    category: false,
    stock: false
  };
  
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  
  currentPage = 1;
  itemsPerPage = 5;

  isEditMode = false;
  editingProductId: number | null = null;
  
  allProducts: Product[] = [];

  constructor(private productsService: ProductsService, private categoriesService: Categories) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
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
        Alert('Error', 'No se pudieron cargar los productos. Intente nuevamente más tarde.', 'error');
        console.error('Error cargando productos:', error);
      }
    });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories: any) => {
        const categoryArray = categories as Category[];
        this.categoriesList = [...categoryArray];
      },
      error: (error: any) => {
        Alert('Error', 'No se pudieron cargar las categorías. Intente nuevamente más tarde.', 'error');
        console.error('Error cargando categorías:', error);
      }
    });
  }

  // Calcular ganancias automáticamente
  calculateEarnings() {
    if (this.newProduct.price_sales && this.newProduct.price) {
      this.newProduct.earnings = Number(this.newProduct.price_sales) - Number(this.newProduct.price);
    } else {
      this.newProduct.earnings = null;
    }
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

  // Obtener estancias únicas
  get stays() {
    const uniqueStays = [...new Set(this.allProducts
      .map(product => product.stay)
      .filter(stay => stay && stay.trim() !== ''))]; // Filtrar valores vacíos o nulos
    return ['Todas', ...uniqueStays];
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

    // Filtrar por estancia
    if (this.selectedStay !== 'Todas') {
      filteredProducts = filteredProducts.filter(product => 
        product.stay === this.selectedStay
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

  deleteProduct(id: string) {
    ConfirmAlert({
      title: 'Eliminar Producto',
      message: '¿Está seguro de que desea eliminar este producto?',
      icon: 'warning',
      btnAccept: 'Sí, eliminar',
      btnCancel: 'Cancelar'
    }).then((result) => {
      if (result) {
        this.confirmDeleteProduct(id);
      }
    });
  }

  confirmDeleteProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        Alert('Éxito', 'Producto eliminado correctamente', 'success');
        this.loadProducts();
      },
      error: (error) => {
        Alert('Error', 'No se pudo eliminar el producto. Intente nuevamente más tarde.', 'error');
        console.error('Error eliminando producto:', error);
        this.loading = false;
      }
    });
  }

  editProduct(product: Product) {
    const existingProduct = this.allProducts.find(p => p.id === product.id);
    if (existingProduct) {
      this.newProduct = {
        id_product: existingProduct.id_product || '',
        name: existingProduct.name,
        price: existingProduct.price,
        price_sales: existingProduct.price_sales || null,
        earnings: existingProduct.earnings,
        category: existingProduct.category,
        availability: existingProduct.availability,
        stock: existingProduct.stock,
        stay: existingProduct.stay || '',
        img: null
      };
      
      if (existingProduct.img) {
        this.imagePreview = this.getImageUrl(existingProduct.img);
      } else {
        this.imagePreview = null;
      }
      
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
    this.currentPage = 1;
  }

  // Limpiar todos los filtros
  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'Todas';
    this.selectedAvailability = 'Todas';
    this.selectedStay = 'Todas';
    this.currentPage = 1;
  }

  // Filtrar por categoría
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
  }

  // Filtrar por disponibilidad
  filterByAvailability(availability: string) {
    this.selectedAvailability = availability;
    this.currentPage = 1;
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
    this.currentPage = 1;
  }

  // Funciones del formulario
  saveProduct() {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  validateField(fieldName: keyof typeof this.formTouched) {
    this.formTouched[fieldName] = true;
  }

  addProduct() {
    // Marcar todos los campos como tocados
    Object.keys(this.formTouched).forEach(key => {
      this.formTouched[key as keyof typeof this.formTouched] = true;
    });

    if (this.isValidProduct()) {
      this.loading = true;
      this.calculateEarnings();
      const productData: Omit<Product, 'id'> = {
        id_product: this.newProduct.id_product,
        name: this.newProduct.name,
        price: Number(this.newProduct.price),
        price_sales: Number(this.newProduct.price_sales),
        earnings: Number(this.newProduct.earnings),
        category: this.newProduct.category,
        availability: this.newProduct.availability,
        stock: this.newProduct.stock,
        stay: this.newProduct.stay,
        img: this.selectedFile || undefined
      };

      this.productsService.createProduct(productData).subscribe({
        next: (response) => {
          Alert('Éxito', 'Producto agregado correctamente', 'success');
          this.loadProducts();
          this.resetForm();
          this.showModal = false;
          this.loading = false;
        },
        error: (error) => {
          Alert('Error', 'No se pudo agregar el producto. Intente nuevamente más tarde.', 'error');
          console.error('Error agregando producto:', error);
        }
      });
    }
  }

  updateProduct() {
    // Marcar todos los campos como tocados
    Object.keys(this.formTouched).forEach(key => {
      this.formTouched[key as keyof typeof this.formTouched] = true;
    });

    if (this.isValidProduct() && this.editingProductId) {
      this.loading = true;
      this.calculateEarnings();
      const productData: Omit<Product, 'id'> = {
        id_product: this.newProduct.id_product,
        name: this.newProduct.name,
        price: Number(this.newProduct.price),
        price_sales: Number(this.newProduct.price_sales),
        earnings: Number(this.newProduct.earnings),
        category: this.newProduct.category,
        availability: this.newProduct.availability,
        stock: this.newProduct.stock,
        stay: this.newProduct.stay,
        img: this.selectedFile || undefined
      };
      
      this.productsService.updateProduct(productData.id_product, productData).subscribe({
        next: (response) => {
          Alert('Éxito', 'Producto actualizado correctamente', 'success');
          this.loadProducts();
          this.resetForm();
          this.showModal = false;
          this.loading = false;
        },
        error: (error) => {
          Alert('Error', 'No se pudo actualizar el producto. Intente nuevamente más tarde.', 'error');
          console.error('Error actualizando producto:', error);
        }
      });
    }
  }

  isValidProduct(): boolean {
    let isValid = true;
    this.formErrors = {
      id_product: '',
      name: '',
      price: '',
      price_sales: '',
      category: '',
      stock: ''
    };

    // Validar ID del producto
    if (!this.newProduct.id_product?.trim()) {
      this.formErrors.id_product = 'El ID del producto es obligatorio';
      isValid = false;
    }

    // Validar nombre
    if (!this.newProduct.name?.trim()) {
      this.formErrors.name = 'El nombre del producto es obligatorio';
      isValid = false;
    }

    // Validar precio de compra
    if (this.newProduct.price === null || this.newProduct.price === undefined) {
      this.formErrors.price = 'El precio de compra es obligatorio';
      isValid = false;
    } else if (this.newProduct.price <= 0) {
      this.formErrors.price = 'El precio de compra debe ser mayor a 0';
      isValid = false;
    }

    // Validar precio de venta
    if (this.newProduct.price_sales === null || this.newProduct.price_sales === undefined) {
      this.formErrors.price_sales = 'El precio de venta es obligatorio';
      isValid = false;
    } else if (this.newProduct.price_sales <= 0) {
      this.formErrors.price_sales = 'El precio de venta debe ser mayor a 0';
      isValid = false;
    }

    // Validar categoría
    if (!this.newProduct.category?.trim()) {
      this.formErrors.category = 'La categoría es obligatoria';
      isValid = false;
    }

    // Validar stock
    if (this.newProduct.stock === null || this.newProduct.stock === undefined) {
      this.formErrors.stock = 'El stock es obligatorio';
      isValid = false;
    } else if (this.newProduct.stock < 0) {
      this.formErrors.stock = 'El stock no puede ser negativo';
      isValid = false;
    }

    return isValid;
  }

  cancelForm() {
    this.resetForm();
    this.showModal = false;
  }

  resetForm() {
    this.newProduct = {
      id_product: '',
      name: '',
      price: null as number | null,
      price_sales: null as number | null,
      earnings: null as number | null,
      category: '',
      availability: true,
      stock: 0,
      stay: '',
      img: null as File | null
    };
    this.isEditMode = false;
    this.editingProductId = null;
    this.imagePreview = null;
    this.selectedFile = null;
    this.formErrors = {
      id_product: '',
      name: '',
      price: '',
      price_sales: '',
      category: '',
      stock: ''
    };
    this.formTouched = {
      id_product: false,
      name: false,
      price: false,
      price_sales: false,
      category: false,
      stock: false
    };
  }

  // Métodos para el manejo de imágenes
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.newProduct.img = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No se seleccionó ningún archivo');
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.newProduct.img = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('productImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getImageUrl(imageBuffer: any): string {
    if (!imageBuffer) {
      return '';
    }
    
    if (imageBuffer.type === 'Buffer' && imageBuffer.data) {
      const uint8Array = new Uint8Array(imageBuffer.data);
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    }
    
    // Si es un array de bytes directamente
    if (Array.isArray(imageBuffer)) {
      const uint8Array = new Uint8Array(imageBuffer);
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    }
    
    // Si ya es una URL o base64
    if (typeof imageBuffer === 'string') {
      return imageBuffer;
    }
    
    return '';
  }
}
