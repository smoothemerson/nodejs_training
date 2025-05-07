import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { GetPetDetailsUseCase } from './get-pet-details'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let organizationRepository: InMemoryOrganizationRepository
let sut: GetPetDetailsUseCase

describe('Get pet details Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new GetPetDetailsUseCase(petsRepository)
  })

  it('should be able to search the details of a pet', async () => {
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

    const petCreated = await petsRepository.create({
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

    const { pet } = await sut.execute({ id: petCreated.id })

    expect(pet).toEqual(expect.objectContaining({ name: 'Luna' }))
  })

  it("shouldn't be able to fetch the details with an inexistant id", async () => {
    await expect(() =>
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
