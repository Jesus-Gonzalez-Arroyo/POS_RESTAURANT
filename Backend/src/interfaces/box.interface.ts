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
  cashsales: number;
  cardsales: number;
  transfersales: number;
  status: 'abierta' | 'cerrada';
  openedby: string;
  closedby?: string;
  transactions: Transaction[];
  notes?: string;
}

interface Transaction {
  id: string;
  type: 'venta' | 'gasto' | 'retiro' | 'ingreso';
  amount: number;
  description: string;
  timestamp: Date;
  paymentMethod?: 'efectivo' | 'tarjeta' | 'transferencia';
}

export { CashRegister, Transaction };