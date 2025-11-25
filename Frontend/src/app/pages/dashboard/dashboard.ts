import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { Dashboard as DashboardService } from '../../core/services/dashboard/dashboard';
import { DashboardData, Order, productsTop } from '../../core/models/index';
import { formatPriceCustom } from '../../shared/utils/formatPrice';
import { Orders as OrdersService } from '../../core/services/orders/orders';
import { Alert } from '../../shared/utils/alert';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard implements OnInit {
  constructor(private dashboardService: DashboardService, private ordersService: OrdersService) {}

  orders: Order[] = []

  productsTop: productsTop[] = []
  salesToday: DashboardData['salesToday'] = {
    total_sales: '0',
    total_revenue: '0',
    total_profits: '0',
    salesCountChange: 0,
    revenueChange: 0,
    profitsChange: 0
  }
  salesMonth: DashboardData['salesMonth'] = {
    total_sales: '0',
    total_revenue: '0',
    total_profits: '0',
    salesCountChange: 0,
    revenueChange: 0,
    profitsChange: 0
  }
  expensesToday: DashboardData['expensesToday'] = {
    total_expenses: '0',
    expensesChange: 0
  }
  expensesMonth: DashboardData['expensesMonth'] = {
    total_expenses: '0',
    expensesChange: 0
  }

  ngOnInit() {
    this.loadDashboardData();
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAllOrders().subscribe({
      next: (orders: any) => {
        this.orders = orders;
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar las órdenes.', 'error');
        console.error('Error loading orders:', error);
      }
    });
  }

  loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data: any) => {
        const dataDashboard = data as DashboardData;
        this.productsTop = dataDashboard.topProducts;
        this.salesToday = dataDashboard.salesToday;
        this.salesMonth = dataDashboard.salesMonth;
        this.expensesToday = dataDashboard.expensesToday;
        this.expensesMonth = dataDashboard.expensesMonth;
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar los datos del dashboard.', 'error');
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  modifyMoneyFormat(amount: string): string {
    return formatPriceCustom(Number(amount));
  }
}
