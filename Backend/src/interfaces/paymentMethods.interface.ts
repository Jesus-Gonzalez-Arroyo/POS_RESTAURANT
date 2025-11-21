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
