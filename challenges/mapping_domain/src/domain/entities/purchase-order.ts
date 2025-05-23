import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface PurchaseOrderProps {
  productId: UniqueEntityID
  quantity: number
  supplierId: UniqueEntityID
  status: string
  date: Date
}

export class PurchaseOrder extends Entity<PurchaseOrderProps> {
  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  get supplierId() {
    return this.props.supplierId
  }

  get status() {
    return this.props.status
  }

  get date() {
    return this.props.date
  }

  static create(props: PurchaseOrderProps, id?: UniqueEntityID) {
    const purchaseOrder = new PurchaseOrder(props, id)

    return purchaseOrder
  }
}
