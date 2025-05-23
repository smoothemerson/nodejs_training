import type { PurchaseOrder } from '../entities/purchase-order'

export interface PurchaseOrderRepository {
  create(order: PurchaseOrder): Promise<void>
  findById(id: string): Promise<PurchaseOrder | null>
}
