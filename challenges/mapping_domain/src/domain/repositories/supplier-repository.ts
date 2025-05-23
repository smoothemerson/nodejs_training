import type { Supplier } from '../entities/supplier'

export interface SupplierRepository {
  create(supplier: Supplier): Promise<void>
  findById(id: string): Promise<Supplier | null>
}
