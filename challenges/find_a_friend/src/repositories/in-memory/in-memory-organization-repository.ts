import { randomUUID } from 'node:crypto'
import type { OrganizationRepository } from '../organization-repository'
import type { Organization, Prisma } from '@prisma/client'

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public items: Organization[] = []

  public async create(
    data: Prisma.OrganizationCreateInput,
  ): Promise<Organization> {
    const organization = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      cep: data.cep,
      address: data.address,
      phone: data.phone,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(organization)

    return organization
  }

  public async findByEmail(email: string): Promise<Organization | null> {
    const organization = this.items.find((item) => item.email === email)

    if (!organization) {
      return null
    }

    return organization
  }
}
