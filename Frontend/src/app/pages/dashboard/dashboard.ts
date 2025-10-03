import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard {
  orders = [
    { id: 1, customer: 'John Doe', total: 99.99, status: 'Pending', pedido: 'Pollo' },
    { id: 2, customer: 'Jane Smith', total: 149.49, status: 'Completed', pedido: 'Pizza' },
    { id: 3, customer: 'Alice Johnson', total: 79.89, status: 'Cancelled', pedido: 'Sushi' }
  ]

  productsTop = [
    { id: 1, name: 'Pollo', sales: 150 },
    { id: 2, name: 'Pizza', sales: 120 },
    { id: 3, name: 'Sushi', sales: 90 }
  ]
}
