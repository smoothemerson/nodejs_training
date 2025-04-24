import type { Organization, Prisma } from '@prisma/client'

export interface OrganizationRepository {
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
  findByEmail(email: string): Promise<Organization | null>
}
