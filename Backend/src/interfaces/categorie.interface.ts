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
