import type { Sale } from '../entities/sale'

export interface SaleRepository {
  create(sale: Sale): Promise<void>
  findByPeriod(start: Date, end: Date): Promise<Sale[]>
}
