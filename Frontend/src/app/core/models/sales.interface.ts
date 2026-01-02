export interface Sale {
  customer: string
  total: string
  paymentmethod: string
  paymentbreakdown?: Array<{ method: string; amount: number }>
  products: Array<{ id: number; name: string; price_sales: number; quantity: number }>
  time: Date
  ganancias?: string
}