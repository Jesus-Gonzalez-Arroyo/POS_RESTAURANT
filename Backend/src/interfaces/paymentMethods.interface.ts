export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}
