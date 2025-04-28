import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let organizationRepository: InMemoryOrganizationRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new CreatePetUseCase(petsRepository, organizationRepository)
  })

  it('should be able to create pet', async () => {
    const organization = await organizationRepository.create({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password_hash: '123456',
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 3456789',
    })

    const { pet } = await sut.execute({
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Vila Mariana',
      road: 'Avenida Paulista',
      phone: '11987654321',
      name: 'Rex',
      description: 'Rex é um cachorro amigável e brincalhão...',
      age: 5,
      size: 'BIG',
      energy_level: 'AVERAGE',
      independence: 'HIGH',
      environment: 'OPEN',
      organization_id: organization.id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be possible to register with a non-existent organization', async () => {
    await expect(() =>
      sut.execute({
        state: 'MG',
        city: 'Belo Horizonte',
        neighborhood: 'Santa Efigênia',
        road: 'Avenida Brasil',
        phone: '31987654321',
        name: 'Luna',
        description: 'Luna é uma gata dócil e carinhosa...',
        age: 2,
        size: 'SMALL',
        energy_level: 'LOW',
        independence: 'HIGH',
        environment: 'OPEN',
        organization_id: 'non-existent-id-123456',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
