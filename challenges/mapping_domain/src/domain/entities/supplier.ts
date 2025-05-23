import { Entity } from '@/core/entities/entity'

interface SupplierProps {
  name: string
  contact: string
}

export class Supplier extends Entity<SupplierProps> {
  get name() {
    return this.props.name
  }

  get contact() {
    return this.props.contact
  }
}
