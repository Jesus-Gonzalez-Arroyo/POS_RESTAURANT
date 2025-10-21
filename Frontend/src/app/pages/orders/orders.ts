import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Orders as OrdersService } from '../../core/services/orders/orders'
import { Alert, ConfirmAlert } from '../../shared/utils/alert';
import { formatPriceCustom } from '../../shared/utils/formatPrice';
import { Sales } from '../../core/services/sales/sales';

export interface Order {
  id: number;
  customer: string;
  total: string;
  isdelivery: boolean;
  deliveryaddress: string | null;
  paymentmethod: string;
  products: Array<{ name: string; price: number; quantity: number }>;
  status: string;
  time: Date;
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orderList: Order[] = [];
  orderStatuses = ['En preparación', 'Completado', 'En delivery', 'Cancelado'];

  constructor(private ordersService: OrdersService, private salesService: Sales) { }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.ordersService.getAllOrders().subscribe({
      next: (orders) => {
        this.orderList = orders;
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar las órdenes. Intente nuevamente más tarde.', 'error');
        console.error('Error loading orders:', error);
      }
    });
  }

  deleteOrder(orderId: number, showAlert: boolean = true) {
    this.ordersService.deleteOrder(orderId).subscribe({
      next: () => {
        if(showAlert) {
          Alert('Orden cancelada', `La orden #${orderId} ha sido cancelada.`, 'success');
        }
        this.getAllOrders()
      }
    });
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    const order = this.orderList.find(o => o.id === orderId);
    if (!order) return

    if (newStatus === this.orderStatuses[1]) {
      const orderCompleted = {
        customer: order.customer,
        total: parseInt(order.total),
        paymentmethod: order.paymentmethod,
        products: order.products,
        time: new Date(),
        ganancias: 0
      }

      this.salesService.createSale(orderCompleted).subscribe({
        next: () => {
          Alert('Completado', 'Venta registrada con exito', 'success')
          this.deleteOrder(orderId, false)
        },
        error: (error) => {
          Alert('Error', 'No se pudo registrar la venta. Intente nuevamente.', 'error');
        }
      })
    }
  }

  cancelOrder(orderId: number) {
    const order = this.orderList.find(o => o.id === orderId);
    if (order && order.status !== 'Completado' && order.status !== 'Cancelado') {
      ConfirmAlert({
        title: 'Cancelar orden',
        message: `¿Está seguro de que desea cancelar la orden #${orderId} de ${order.customer}?`,
        icon: 'warning',
        btnAccept: 'Sí, cancelar',
        btnCancel: 'No, mantener'
      }).then((confirmed) => {
        if (confirmed) {
          order.status = 'Cancelado';
          this.deleteOrder(orderId)
        }
      });
    } else if (order && (order.status === 'Completado' || order.status === 'Cancelado')) {
      Alert('Accion no permitidad', 'No se puede cancelar una orden que ya está completada o cancelada.', 'error')
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

  formatPrice(price: string): string {
    return formatPriceCustom(parseFloat(price));
  }
}
