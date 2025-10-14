import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Orders } from '../../core/services/orders/orders';
import { formatPriceCustom } from '../../shared/utils/formatPrice'
import { Alert, ConfirmAlert } from '../../shared/utils/alert';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  standalone: true
})
export class Sales {

  constructor(private ordersService: Orders) {}

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
  
  allProducts = [
    { name: 'Pollo Entero', price: 25000, category: 'Pollo Asado'},
    { name: 'Medio Pollo', price: 13000, category: 'Pollo Asado'},
    { name: 'Cuarto de Pollo', price: 7000, category: 'Pollo Asado'},
    { name: 'Coca Cola', price: 2500, category: 'Bebidas'},
    { name: 'Pepsi', price: 2500, category: 'Bebidas'},
    { name: 'Agua Natural', price: 1500, category: 'Bebidas'},
    { name: 'Arroz', price: 3000, category: 'Acompañamientos'},
    { name: 'Papas Fritas', price: 3500, category: 'Acompañamientos'},
    { name: 'Ensalada', price: 4000, category: 'Acompañamientos'},
    { name: 'Flan', price: 4500, category: 'Postres'},
    { name: 'Helado', price: 3500, category: 'Postres'},
  ];

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
    return this.cart.reduce((total, item) => total + item.total, 0);
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

    const order = {
      customer: this.customerName,
      isDelivery: this.isDelivery,
      deliveryAddress: this.isDelivery ? this.deliveryAddress : null,
      paymentMethod: this.paymentMethod,
      products: this.cart,
      total: String(this.orderTotal),
      timestamp: new Date(),
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
            console.log('Imprimiendo recibo para la orden:', response);
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
}
