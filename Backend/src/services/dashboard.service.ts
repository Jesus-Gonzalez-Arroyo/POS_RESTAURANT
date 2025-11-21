import pool from "../config/connectDB";

export const getDashboardData = async () => {
    const salesToday = await getSalesToday();
    const salesYesterday = await getSalesYesterday();
    const salesMonth = await getSalesMonth();
    const salesLastMonth = await getSalesLastMonth();
    const expensesToday = await getExpensesToday();
    const expensesYesterday = await getExpensesYesterday();
    const expensesMonth = await getExpensesMonth();
    const expensesLastMonth = await getExpensesLastMonth();
    const topProducts = await getTopProducts();

    // Calcular porcentajes de cambio para HOY vs AYER
    const salesCountChangeToday = calculatePercentageChange(
        parseInt(salesToday.total_sales),
        parseInt(salesYesterday.total_sales)
    );

    const revenueChangeToday = calculatePercentageChange(
        parseFloat(salesToday.total_revenue),
        parseFloat(salesYesterday.total_revenue)
    );

    const profitsChangeToday = calculatePercentageChange(
        parseFloat(salesToday.total_profits),
        parseFloat(salesYesterday.total_profits)
    );

    const expensesChangeToday = calculatePercentageChange(
        parseFloat(expensesToday.total_expenses),
        parseFloat(expensesYesterday.total_expenses)
    );

    // Calcular porcentajes de cambio para ESTE MES vs MES PASADO
    const salesCountChangeMonth = calculatePercentageChange(
        parseInt(salesMonth.total_sales),
        parseInt(salesLastMonth.total_sales)
    );

    const revenueChangeMonth = calculatePercentageChange(
        parseFloat(salesMonth.total_revenue),
        parseFloat(salesLastMonth.total_revenue)
    );

    const profitsChangeMonth = calculatePercentageChange(
        parseFloat(salesMonth.total_profits),
        parseFloat(salesLastMonth.total_profits)
    );

    const expensesChangeMonth = calculatePercentageChange(
        parseFloat(expensesMonth.total_expenses),
        parseFloat(expensesLastMonth.total_expenses)
    );

    return { 
        salesToday: { 
            ...salesToday, 
            salesCountChange: salesCountChangeToday,
            revenueChange: revenueChangeToday,
            profitsChange: profitsChangeToday
        },
        expensesToday: {
            ...expensesToday,
            expensesChange: expensesChangeToday
        },
        salesMonth: { 
            ...salesMonth, 
            salesCountChange: salesCountChangeMonth,
            revenueChange: revenueChangeMonth,
            profitsChange: profitsChangeMonth
        },
        expensesMonth: {
            ...expensesMonth,
            expensesChange: expensesChangeMonth
        },
        topProducts 
    };
}

const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

const getSalesToday = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COUNT(*) AS total_sales, 
            COALESCE(SUM(total::numeric), 0) AS total_revenue,
            COALESCE(SUM(ganancias::numeric), 0) AS total_profits
        FROM sales 
        WHERE DATE(time) = CURRENT_DATE
    `);
    return res.rows[0];
}

const getSalesYesterday = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COUNT(*) AS total_sales, 
            COALESCE(SUM(total::numeric), 0) AS total_revenue,
            COALESCE(SUM(ganancias::numeric), 0) AS total_profits
        FROM sales 
        WHERE DATE(time) = CURRENT_DATE - INTERVAL '1 day'
    `);
    return res.rows[0];
}

const getSalesMonth = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COUNT(*) AS total_sales, 
            COALESCE(SUM(total::numeric), 0) AS total_revenue,
            COALESCE(SUM(ganancias::numeric), 0) AS total_profits
        FROM sales 
        WHERE DATE_PART('month', time) = DATE_PART('month', CURRENT_DATE) 
        AND DATE_PART('year', time) = DATE_PART('year', CURRENT_DATE)
    `);
    return res.rows[0];
}

const getSalesLastMonth = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COUNT(*) AS total_sales, 
            COALESCE(SUM(total::numeric), 0) AS total_revenue,
            COALESCE(SUM(ganancias::numeric), 0) AS total_profits
        FROM sales 
        WHERE DATE_PART('month', time) = DATE_PART('month', CURRENT_DATE - INTERVAL '1 month')
        AND DATE_PART('year', time) = DATE_PART('year', CURRENT_DATE - INTERVAL '1 month')
    `);
    return res.rows[0];
}

const getTopProducts = async (): Promise<any[]> => {
    const res = await pool.query(`
        SELECT
            prod.product->>'name' AS name,
            SUM((prod.product->>'quantity')::int) AS total_sold
        FROM
            sales s,
            LATERAL jsonb_array_elements(s.products) AS prod(product)
        GROUP BY
            prod.product->>'name'
        ORDER BY
            total_sold DESC
        LIMIT 10
    `);
    return res.rows;
}

const getExpensesToday = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COALESCE(SUM(amount::numeric), 0) AS total_expenses
        FROM bills 
        WHERE DATE(date) = CURRENT_DATE
    `);
    return res.rows[0];
}

const getExpensesYesterday = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COALESCE(SUM(amount::numeric), 0) AS total_expenses
        FROM bills 
        WHERE DATE(date) = CURRENT_DATE - INTERVAL '1 day'
    `);
    return res.rows[0];
}

const getExpensesMonth = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COALESCE(SUM(amount::numeric), 0) AS total_expenses
        FROM bills 
        WHERE DATE_PART('month', date) = DATE_PART('month', CURRENT_DATE) 
        AND DATE_PART('year', date) = DATE_PART('year', CURRENT_DATE)
    `);
    return res.rows[0];
}

const getExpensesLastMonth = async (): Promise<any> => {
    const res = await pool.query(`
        SELECT 
            COALESCE(SUM(amount::numeric), 0) AS total_expenses
        FROM bills 
        WHERE DATE_PART('month', date) = DATE_PART('month', CURRENT_DATE - INTERVAL '1 month')
        AND DATE_PART('year', date) = DATE_PART('year', CURRENT_DATE - INTERVAL '1 month')
    `);
    return res.rows[0];
}