import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Orders } from '../../core/services/orders/orders';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/models/index';
import { formatPriceCustom } from '../../shared/utils/formatPrice'
import { Alert, ConfirmAlert } from '../../shared/utils/alert';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  standalone: true
})
export class Sales implements OnInit  {

  selectedCategory = 'Todos';
  categories = ['Todos', 'Pollo Asado', 'Bebidas', 'Acompañamientos', 'Postres'];
  searchTerm = '';
  
  cart: {name: string, price: number, quantity: number, total: number}[] = [];
  
  // Datos del cliente y orden
  customerName = '';
  isDelivery = false;
  deliveryAddress = '';
  paymentMethod = 'efectivo';
  paymentMethods = [
    {value: 'efectivo', label: 'Efectivo'},
    {value: 'tarjeta', label: 'Tarjeta'},
    {value: 'transferencia', label: 'Transferencia'}
  ];
  
  allProducts = [] as Product[];

  constructor(
    private ordersService: Orders,
    private router: Router,
    @Inject(ProductsService) private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.allProducts = products;
      },
      error: (error: any) => {
        Alert('Error', 'No se pudieron cargar los productos. Intente nuevamente más tarde.', 'error');
        console.error('Error loading products:', error);
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
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
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

    // Limpiar las imágenes de los productos antes de crear la orden
    const productsWithoutImages = this.cart.map(product => {
      const { ...productWithoutImg } = product;
      // Eliminar cualquier propiedad de imagen que pudiera existir
      delete (productWithoutImg as any).img;
      delete (productWithoutImg as any).image;
      return productWithoutImg;
    });

    const order = {
      customer: this.customerName,
      isdelivery: this.isDelivery,
      deliveryaddress: this.isDelivery ? this.deliveryAddress : null,
      paymentmethod: this.paymentMethod,
      products: productsWithoutImages,
      total: String(this.orderTotal),
      time: new Date(),
      status: 'En preparación'
    };

    this.ordersService.createOrder(order).subscribe({
      next: (response) => {
        ConfirmAlert({
          title: 'Orden creada',
          message: `La orden ha sido creada exitosamente.`,
          icon: 'success',
          btnAccept: 'Visualizar pedido',
          btnCancel: 'Cerrar'
        }).then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/orders']);
          }
        });
      },
      error: (error) => {
        Alert('Error al crear la orden', 'Por favor intente nuevamente más tarde.', 'error');
        console.error('Error al crear la orden:', error);
      }
    });
    
    this.resetOrder();
  }

  // Limpiar formulario
  resetOrder() {
    this.customerName = '';
    this.isDelivery = false;
    this.deliveryAddress = '';
    this.paymentMethod = 'efectivo';
    this.cart = [];
  }

  addCartProduct(product: {name: string, price: number}) {
    const existingItem = this.cart.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      this.cart.push({...product, quantity: 1, total: product.price});
    }
  }

  increaseQuantity(item: {name: string, price: number, quantity: number, total: number}) {
    item.quantity++;
    item.total = item.price * item.quantity;
  }

  decreaseQuantity(item: {name: string, price: number, quantity: number, total: number}) {
    if (item.quantity > 1) {
      item.quantity--;
      item.total = item.price * item.quantity;
    }
  }

  removeFromCart(item: {name: string, price: number, quantity: number, total: number}) {
    const index = this.cart.indexOf(item);
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
