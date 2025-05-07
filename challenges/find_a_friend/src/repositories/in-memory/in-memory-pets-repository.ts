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

  async findByCity(city: string): Promise<Pet[]> {
    const pets = this.itens.filter((item) => item.city === city)

    return Promise.resolve(pets)
  }

  async getPetDetails(id: string): Promise<Pet | null> {
    const pet = this.itens.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async filterPets(
    city?: string,
    neighborhood?: string,
    name?: string,
    age?: number,
  ): Promise<Pet[]> {
    const pets = this.itens.filter(
      (item) =>
        item.city === city ||
        item.neighborhood === neighborhood ||
        item.name === name ||
        item.age === age,
    )

    return pets
  }

  async delete(id: string) {
    const pet = this.itens.find((item) => item.id === id)

    if (!pet) return null

    return pet
  }
}
