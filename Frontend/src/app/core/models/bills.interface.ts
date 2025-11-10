export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: 'servicios' | 'empleados' | 'proveedores';
  date: Date;
  notes?: string;
  paymentmethod: 'efectivo' | 'tarjeta' | 'transferencia';
  createdby: string;
}
