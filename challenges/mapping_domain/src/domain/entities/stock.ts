import { Entity } from '@/core/entities/entity'
import type { Product } from './product'

interface StockProps {
  products: Product[]
}

export class Stock extends Entity<StockProps> {
  get products() {
    return this.props.products
  }
}
