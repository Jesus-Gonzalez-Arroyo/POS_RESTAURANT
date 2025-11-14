export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  color: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}
