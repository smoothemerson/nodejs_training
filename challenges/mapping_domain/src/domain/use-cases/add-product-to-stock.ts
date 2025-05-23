import type { ProductRepository } from '../repositories/products-repository'

interface AddProductToStockUseCaseRequest {
  productId: string
  quantity: number
}

interface AddProductToStockUseCaseResponse {
  success: boolean
  currentQuantity: number
}

export class AddProductToStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
    quantity,
  }: AddProductToStockUseCaseRequest): Promise<AddProductToStockUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const updatedProduct = Object.assign(product, {
      props: {
        name: product.name,
        size: product.size,
        color: product.color,
        quantity: product.quantity + quantity,
        minQuantity: product.minQuantity,
        price: product.price,
      },
    })

    await this.productRepository.create(updatedProduct)

    return {
      success: true,
      currentQuantity: updatedProduct.quantity,
    }
  }
}
