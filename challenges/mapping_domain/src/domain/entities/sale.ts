import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface SaleProps {
  productId: UniqueEntityID
  quantity: number
  date: Date
  total: number
}

export class Sale extends Entity<SaleProps> {
  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  get date() {
    return this.props.date
  }

  get total() {
    return this.props.total
  }
}
