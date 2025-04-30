import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DeletePetUseCase } from './delete-pet'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let organizationRepository: InMemoryOrganizationRepository
let sut: DeletePetUseCase

describe('Delete Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new DeletePetUseCase(petsRepository)
  })

  it('should be able to delete pet', async () => {
    const organization = await organizationRepository.create({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 34567890',
      id: '',
      created_at: new Date(),
    })

    const { id } = await petsRepository.create({
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
      organization_id: organization.id,
    })

    const { pet } = await sut.execute({
      id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be possible to delete with a non-existent id', async () => {
    const organization = await organizationRepository.create({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 34567890',
      id: '',
      created_at: new Date(),
    })

    await petsRepository.create({
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
      organization_id: organization.id,
    })

    await expect(async () => {
      await sut.execute({
        id: 'non-existent id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
