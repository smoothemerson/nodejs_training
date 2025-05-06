import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FilterPetsUseCase } from './filter-pets'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let organizationRepository: InMemoryOrganizationRepository
let sut: FilterPetsUseCase

describe('Filter pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new FilterPetsUseCase(petsRepository)
  })

  it('should be able to filter pets', async () => {
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
      description: 'Luna é uma gata dócil e carinhosa',
      age: 2,
      size: 'SMALL',
      energy_level: 'LOW',
      independence: 'HIGH',
      environment: 'OPEN',
      organization_id: organization.id,
    })

    await petsRepository.create({
      state: 'MG',
      city: 'Belo Horizonte',
      neighborhood: 'Santa Efigênia',
      road: 'Avenida Brasil',
      phone: '31987654321',
      name: 'Luna',
      description: 'Luna é uma gata dócil e carinhosa',
      age: 2,
      size: 'SMALL',
      energy_level: 'LOW',
      independence: 'HIGH',
      environment: 'OPEN',
      organization_id: organization.id,
    })

    const { pets } = await sut.execute({ name: 'Luna', city: 'Belo Horizonte' })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Luna' }),
      expect.objectContaining({ name: 'Luna' }),
    ])
  })

  it('should not be able to filter pets with non-existent filters', async () => {
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
      description: 'Luna é uma gata dócil e carinhosa',
      age: 2,
      size: 'SMALL',
      energy_level: 'LOW',
      independence: 'HIGH',
      environment: 'OPEN',
      organization_id: organization.id,
    })

    await expect(() =>
      sut.execute({ name: 'non-existent filter' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to filter pets with non-existent data', async () => {
    await expect(() =>
      sut.execute({ name: 'non-existent filter' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
