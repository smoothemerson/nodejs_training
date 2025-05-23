import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PurchaseOrder } from '../entities/purchase-order'
import type { ProductRepository } from '../repositories/products-repository'
import type { PurchaseOrderRepository } from '../repositories/purchase-order-repository'
import type { SupplierRepository } from '../repositories/supplier-repository'

interface CreatePurchaseOrderUseCaseRequest {
  productId: string
  quantity: number
  supplierId: string
}

interface CreatePurchaseOrderUseCaseResponse {
  purchaseOrder: PurchaseOrder
}

export class CreatePurchaseOrderUseCase {
  constructor(
    private purchaseOrderRepository: PurchaseOrderRepository,
    private productRepository: ProductRepository,
    private supplierRepository: SupplierRepository
  ) {}

  async execute({
    productId,
    quantity,
    supplierId,
  }: CreatePurchaseOrderUseCaseRequest): Promise<CreatePurchaseOrderUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const supplier = await this.supplierRepository.findById(supplierId)

    if (!supplier) {
      throw new Error('Supplier not found')
    }

    const purchaseOrder = PurchaseOrder.create({
      productId: new UniqueEntityID(productId),
      supplierId: new UniqueEntityID(supplierId),
      quantity,
      status: 'pending',
      date: new Date(),
    })

    await this.purchaseOrderRepository.create(purchaseOrder)

    return {
      purchaseOrder,
    }
  }
}
