import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Orders } from '../../core/services/orders/orders';
import { ProductsService } from '../../core/services/products/products.service';
import { Categories } from '../../core/services/categories/categories';
import { Category, PaymentMethod, Product } from '../../core/models/index';
import { formatPriceCustom } from '../../shared/utils/formatPrice'
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { PaymenthMethods } from '../../core/services/paymenthMethods/paymenth-methods';
import { BoxRegister } from '../../core/services/box/box-register';
import { Sales as salesService } from '../../core/services/sales/sales';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  standalone: true
})
export class Sales implements OnInit {

  selectedCategory = 'Todos';
  categories: Category[] = [];
  searchTerm = '';
  scanInput = '';
  isLoading: boolean = false;

  cart: {id: number, name: string, price_sales: number, quantity: number, total: number, stock?: number }[] = [];

  // Datos del cliente and order
  customerName = '';
  isDelivery = false;
  deliveryAddress = '';
  paymentMethod = 'efectivo';
  paymentMethods: { value: string, label: string }[] = [];
  change: number | null = null;

  allProducts = [] as Product[];

  constructor(
    private ordersService: Orders,
    private router: Router,
    @Inject(ProductsService) private productsService: ProductsService,
    private categoriesService: Categories,
    private paymentsService: PaymenthMethods,
    private salesService: salesService,
    private boxService: BoxRegister
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadPaymentMethods();
  }

  loadProducts() {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.allProducts = products;
        this.isLoading = false;
      },
      error: (error: any) => {
        Alert('Error', 'No se pudieron cargar los productos. Intente nuevamente más tarde.', 'error');
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories: any) => {
        const categoryArray = categories as Category[];
        this.categories = [...categoryArray];
      },
      error: (error: any) => {
        Alert('Error', 'No se pudieron cargar las categorías. Intente nuevamente más tarde.', 'error');
        console.error('Error loading categories:', error);
      }
    });
  }

  loadPaymentMethods() {
    this.paymentsService.getPaymentMethods().subscribe({
      next: (methods: any) => {
        const methodsArray = methods as PaymentMethod[];
        this.paymentMethods = methodsArray.map(method => ({ value: method.name, label: method.name }));
      },
      error: (error: any) => {
        Alert('Error', 'No se pudieron cargar los métodos de pago. Intente nuevamente más tarde.', 'error');
        console.error('Error loading payment methods:', error);
      }
    });
  }

  get products() {
    const searchTerm = this.searchTerm.toLowerCase();
    let filteredProducts = this.allProducts;

    // Filtrar por categoría
    if (this.selectedCategory !== 'Todos') {
      filteredProducts = filteredProducts.filter(product => product.category === this.selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );
    }

    return filteredProducts;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  // Calcular total de la compra
  get orderTotal(): number {
    return this.cart.reduce((total, item) => total + item.price_sales * item.quantity, 0);
  }

  // Finalizar compra
  finalizePurchase() {
    if (!this.customerName.trim()) {
      Alert('Datos incompletos', 'Por favor ingrese el nombre del cliente', 'warning');
      return;
    }

    if (this.isDelivery && !this.deliveryAddress.trim()) {
      Alert('Datos incompletos', 'Por favor ingrese la dirección de entrega', 'warning');
      return;
    }

    if (this.cart.length === 0) {
      Alert('Carrito vacío', 'El carrito está vacío, por favor agregue productos', 'warning');
      return;
    }

    const productsWithoutImages = this.cart.map(product => {
      const { ...productWithoutImg } = product;
      delete (productWithoutImg as any).img;
      delete (productWithoutImg as any).image;
      return productWithoutImg;
    });

    const orderCompleted = {
      customer: this.customerName,
      total: String(this.orderTotal),
      paymentmethod: this.paymentMethod,
      products: productsWithoutImages,
      time: new Date(),
    }

    this.salesService.createSale(orderCompleted).subscribe({
      next: () => {
        const saleAmount = parseInt(orderCompleted.total);
        const registeredInBox = this.boxService.registerSale(saleAmount, orderCompleted.paymentmethod);

        if (registeredInBox) {
          Alert('Completado', 'Venta registrada con éxito', 'success');
        } else {
          Alert('Completado', 'Venta registrada con éxito. No hay caja abierta.', 'warning');
        }
        this.descuentStockProducts();
      },
      error: (error: any) => {
        Alert('Error', 'No se pudo registrar la venta. Intente nuevamente.', 'error');
      }
    })

    this.resetOrder();
  }

  // Limpiar formulario
  resetOrder() {
    this.customerName = '';
    this.isDelivery = false;
    this.deliveryAddress = '';
    this.paymentMethod = 'efectivo';
    this.cart = [];
    this.change = null;
  }

  // Descontar stock de los productos vendidos
  descuentStockProducts() {
    for (const item of this.cart) {
      const product = this.allProducts.find(p => p.id === item.id);
      if(product) {
        product.stock = product.stock - item.quantity;
      }
    }
  }
    

  // Buscar producto por escaneo y agregarlo automáticamente
  onScanProduct() {
    if (!this.scanInput.trim()) {
      return;
    }

    const searchTerm = this.scanInput.toLowerCase().trim();

    const product = this.allProducts.find(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.name.toLowerCase() === searchTerm
    );

    if (product) {
      if (!product.availability) {
        Alert('No disponible', `El producto ${product.name} no está disponible`, 'warning');
        this.scanInput = '';
        return;
      }

      if (product.stock === 0) {
        Alert('Sin stock', `El producto ${product.name} no tiene stock disponible`, 'warning');
        this.scanInput = '';
        return;
      }
      
      this.addCartProduct(product);
      Alert('Producto agregado', `${product.name} agregado al carrito`, 'success');
    } else {
      Alert('Producto no encontrado', `No se encontró ningún producto con el código: ${this.scanInput}`, 'error');
    }

    this.scanInput = '';
  }

  addCartProduct(product: { id: number, name: string, price_sales: number, stock: number }) {
    const existingItem = this.cart.find(item => item.name === product.name);
    if (existingItem) {
      if(existingItem.quantity >= product.stock) {
        Alert('Stock insuficiente', `No hay suficiente stock de ${product.name}`, 'warning');
        return;
      }

      existingItem.quantity++;
      existingItem.total = existingItem.price_sales * existingItem.quantity;
    } else {
      this.cart.push({ ...product, price_sales: product.price_sales, quantity: 1, total: product.price_sales });
    }
  }

  increaseQuantity(item: { name: string, price_sales: number, quantity: number, total: number, stock?: number }) {
    if (item.stock !== undefined && item.quantity >= item.stock) {
      Alert('Stock insuficiente', `No hay suficiente stock de ${item.name}. Disponible: ${item.stock}`, 'warning');
      return;
    }
    item.quantity++;
    item.total = item.price_sales * item.quantity;
  }

  decreaseQuantity(item: { name: string, price_sales: number, quantity: number, total: number }) {
    if (item.quantity > 1) {
      item.quantity--;
      item.total = item.price_sales * item.quantity;
    }
  }

  updateQuantity(item: { name: string, price_sales: number, quantity: number, total: number, stock?: number }, newQuantity: number) {
    if (isNaN(newQuantity) || newQuantity === null || newQuantity === undefined) {
      item.quantity = 1;
      item.total = item.price_sales * item.quantity;
      return;
    }

    const quantity = Math.floor(Math.abs(Number(newQuantity)));

    if (quantity < 1) {
      item.quantity = 1;
      item.total = item.price_sales * item.quantity;
      Alert('Cantidad inválida', 'La cantidad mínima es 1', 'warning');
      return;
    }

    if (item.stock !== undefined && quantity > item.stock) {
      item.quantity = item.stock;
      item.total = item.price_sales * item.quantity;
      Alert('Stock insuficiente', `Solo hay ${item.stock} unidades disponibles de ${item.name}`, 'warning');
      return;
    }

    item.quantity = quantity;
    item.total = item.price_sales * item.quantity;
  }

  removeFromCart(item: { id: number, name: string, price_sales: number, quantity: number, total: number, stock?: number }) {
    const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  }

  formatPrice(price: number): string {
    return formatPriceCustom(price);
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

    if (Array.isArray(imageBuffer)) {
      const uint8Array = new Uint8Array(imageBuffer);
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    }

    if (typeof imageBuffer === 'string') {
      return imageBuffer;
    }

    return '';
  }
}
