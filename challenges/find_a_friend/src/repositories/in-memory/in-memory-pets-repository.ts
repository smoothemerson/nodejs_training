import type { Prisma, Pet } from '@prisma/client'
import type { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public itens: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      road: data.road,
      phone: data.phone,
      name: data.name,
      description: data.description,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence: data.independence,
      environment: data.environment,
      created_at: new Date(),
      organization_id: data.organization_id,
    }

    this.itens.push(pet)

    return pet
  }
}
