export interface DashboardData {
    salesToday: {
        total_sales: string;
        total_revenue: string;
        total_profits: string;
        salesCountChange: number;
        revenueChange: number;
        profitsChange: number;
    },
    expensesToday: {
        total_expenses: string;
        expensesChange: number;
    }
    salesMonth: {
        total_sales: string;
        total_revenue: string;
        total_profits: string;
        salesCountChange: number;
        revenueChange: number;
        profitsChange: number;
    },
    expensesMonth: {
        total_expenses: string;
        expensesChange: number;
    },
    topProducts: Array<{
        name: string;
        total_sold: string;
    }>;
}

export interface productsTop {
    name: string;
    total_sold: string;
}