import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  standalone: true
})
export class Sales {
  selectedCategory = 'Todos';
  categories = ['Todos', 'Pollo Asado', 'Bebidas', 'Acompañamientos', 'Postres'];
  searchTerm = '';
  
  // Datos del carrito y orden
  cart: {name: string, price: number, quantity: number, total: number}[] = [
    {name: 'Producto 1', price: 100, quantity: 2, total: 200},
    {name: 'Producto 2', price: 150, quantity: 1, total: 150}
  ];
  
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
    { name: 'Pollo Entero', price: 250, category: 'Pollo Asado'},
    { name: 'Medio Pollo', price: 130, category: 'Pollo Asado'},
    { name: 'Cuarto de Pollo', price: 70, category: 'Pollo Asado'},
    { name: 'Coca Cola', price: 25, category: 'Bebidas'},
    { name: 'Pepsi', price: 25, category: 'Bebidas'},
    { name: 'Agua Natural', price: 15, category: 'Bebidas'},
    { name: 'Arroz', price: 30, category: 'Acompañamientos'},
    { name: 'Papas Fritas', price: 35, category: 'Acompañamientos'},
    { name: 'Ensalada', price: 40, category: 'Acompañamientos'},
    { name: 'Flan', price: 45, category: 'Postres'},
    { name: 'Helado', price: 35, category: 'Postres'},
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
      alert('Por favor ingrese el nombre del cliente');
      return;
    }

    if (this.isDelivery && !this.deliveryAddress.trim()) {
      alert('Por favor ingrese la dirección de entrega');
      return;
    }

    if (this.cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const order = {
      customer: this.customerName,
      isDelivery: this.isDelivery,
      deliveryAddress: this.isDelivery ? this.deliveryAddress : null,
      paymentMethod: this.paymentMethod,
      items: this.cart,
      total: this.orderTotal,
      timestamp: new Date()
    };

    console.log('Orden creada:', order);
    alert(`Compra finalizada por $${this.orderTotal}\nCliente: ${this.customerName}\nMétodo de pago: ${this.paymentMethod}`);
    
    // Limpiar formulario después de la compra
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
}
