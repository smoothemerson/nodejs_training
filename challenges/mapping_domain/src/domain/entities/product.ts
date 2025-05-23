import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface ProductProps {
  name: string
  size: string
  color: string
  price: number
  quantity: number
  minQuantity: number
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  get size() {
    return this.props.size
  }

  get color() {
    return this.props.color
  }

  get price() {
    return this.props.price
  }

  get quantity() {
    return this.props.quantity
  }

  get minQuantity() {
    return this.props.minQuantity
  }

  static create(id: UniqueEntityID, props: ProductProps): Product {
    const product = new Product(props, id)

    return product
  }
}
