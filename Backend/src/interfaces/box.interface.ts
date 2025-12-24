interface CashRegister {
  id: string;
  openingdate: Date;
  closingdate?: Date;
  openingamount: number;
  closingamount?: number;
  expectedamount?: number;
  difference?: number;
  totalsales: number;
  totalexpenses: number;
  salesbymethod: { [methodName: string]: number }; // Ventas dinámicas por método de pago
  status: 'abierta' | 'cerrada';
  openedby: string;
  closedby?: string;
  transactions: Transaction[];
  notes?: string;
}

interface Transaction {
  id: string;
  type: 'venta' | 'gasto' | 'retiro' | 'ingreso' | 'devolucion';
  amount: number;
  description: string;
  timestamp: Date;
  paymentMethod?: 'efectivo' | 'tarjeta' | 'transferencia';
}

export { CashRegister, Transaction };