import type { Product } from '../entities/product'
import type { ProductRepository } from '../repositories/products-repository'

interface CheckLowStockProductsUseCaseResponse {
  lowStockProducts: Product[]
}

export class CheckLowStockProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<CheckLowStockProductsUseCaseResponse> {
    const products = await this.productRepository.findAll()

    const lowStockProducts = products.filter(
      product => product.quantity <= product.minQuantity
    )

    return {
      lowStockProducts,
    }
  }
}
