import type {
  Prisma,
  Size,
  EnergyLevel,
  IndependenceLevel,
  Environment,
} from '@prisma/client'
import type { PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findByCity(city: string) {
    const pets = await prisma.pet.findMany({
      where: {
        city,
      },
    })

    return pets
  }

  async getPetDetails(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async delete(id: string) {
    const pet = prisma.pet.delete({
      where: {
        id,
      },
    })

    return pet
  }

  async filterPets(
    city?: string,
    neighborhood?: string,
    name?: string,
    age?: number,
    size?: Size,
    energyLevel?: EnergyLevel,
    independenceLevel?: IndependenceLevel,
    environment?: Environment,
  ) {
    const filterConditions: Record<string, unknown>[] = []

    const addCondition = (key: string, value?: unknown) => {
      if (value) {
        filterConditions.push({ [key]: value })
      }
    }

    addCondition('city', city)
    addCondition('neighborhood', neighborhood)
    addCondition('name', name)
    addCondition('age', age)
    addCondition('size', size)
    addCondition('energy_level', energyLevel)
    addCondition('independence_level', independenceLevel)
    addCondition('environment', environment)

    const pets = await prisma.pet.findMany({
      where: {
        OR: filterConditions,
      },
    })

    return pets
  }
}
