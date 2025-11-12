export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
