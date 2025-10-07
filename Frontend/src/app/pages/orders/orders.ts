import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  orderList = [
    { 
      id: 1, 
      customer: 'Juan Perez', 
      total: 300, 
      status: 'En preparación',
      items: [
        { name: 'Pollo Entero', quantity: 1, price: 250 },
        { name: 'Coca Cola', quantity: 2, price: 25 }
      ],
      timestamp: new Date(2025, 9, 7, 10, 30),
      isDelivery: false,
      deliveryAddress: null,
      paymentMethod: 'Efectivo'
    },
    { 
      id: 2, 
      customer: 'María González', 
      total: 180, 
      status: 'En preparación',
      items: [
        { name: 'Medio Pollo', quantity: 1, price: 130 },
        { name: 'Arroz', quantity: 1, price: 30 },
        { name: 'Pepsi', quantity: 1, price: 25 }
      ],
      timestamp: new Date(2025, 9, 7, 11, 15),
      isDelivery: true,
      deliveryAddress: 'Av. Principal 123, Edificio Torres',
      paymentMethod: 'Tarjeta'
    },
    { 
      id: 3, 
      customer: 'Carlos Sanchez', 
      total: 450, 
      status: 'Completado',
      items: [
        { name: 'Pollo Entero', quantity: 2, price: 250 },
        { name: 'Papas Fritas', quantity: 2, price: 35 },
        { name: 'Agua Natural', quantity: 3, price: 15 }
      ],
      timestamp: new Date(2025, 9, 7, 9, 45),
      isDelivery: false,
      deliveryAddress: null,
      paymentMethod: 'Transferencia'
    },
    { 
      id: 4, 
      customer: 'Ana Torres', 
      total: 215, 
      status: 'En delivery',
      items: [
        { name: 'Cuarto de Pollo', quantity: 2, price: 70 },
        { name: 'Ensalada', quantity: 1, price: 40 },
        { name: 'Flan', quantity: 1, price: 45 }
      ],
      timestamp: new Date(2025, 9, 7, 12, 0),
      isDelivery: true,
      deliveryAddress: 'Calle Secundaria 456, Casa Azul',
      paymentMethod: 'Efectivo'
    },
  ];

  orderStatuses = ['En preparación', 'Completado', 'En delivery', 'Cancelado'];

  updateOrderStatus(orderId: number, newStatus: string) {
    const order = this.orderList.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      console.log(`Orden ${orderId} actualizada a: ${newStatus}`);
    }
  }

  cancelOrder(orderId: number) {
    const order = this.orderList.find(o => o.id === orderId);
    if (order && order.status !== 'Completado' && order.status !== 'Cancelado') {
      const confirmCancel = confirm(`¿Está seguro de que desea cancelar la orden #${orderId} de ${order.customer}?`);
      if (confirmCancel) {
        order.status = 'Cancelado';
        console.log(`Orden ${orderId} cancelada`);
      }
    } else if (order && (order.status === 'Completado' || order.status === 'Cancelado')) {
      alert('No se puede cancelar una orden que ya está completada o cancelada.');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'En preparación':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
