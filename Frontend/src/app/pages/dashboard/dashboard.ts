import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { Dashboard as DashboardService } from '../../core/services/dashboard/dashboard';
import { DashboardData, productsTop } from '../../core/models/index';
import { formatPriceCustom } from '../../shared/utils/formatPrice';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard {
  constructor(private dashboardService: DashboardService) {}

  orders = [
    { id: 1, customer: 'John Doe', total: 99.99, status: 'Pending', pedido: 'Pollo' },
    { id: 2, customer: 'Jane Smith', total: 149.49, status: 'Completed', pedido: 'Pizza' },
    { id: 3, customer: 'Alice Johnson', total: 79.89, status: 'Cancelled', pedido: 'Sushi' }
  ]

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
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  modifyMoneyFormat(amount: string): string {
    return formatPriceCustom(Number(amount));
  }
}
