import { compare } from 'bcryptjs'
import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { CreateOrganizationUseCase } from './create-organization'
import { beforeEach, describe, expect, it } from 'vitest'

let organizationRepository: InMemoryOrganizationRepository
let sut: CreateOrganizationUseCase

describe('Create Organization Use Case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new CreateOrganizationUseCase(organizationRepository)
  })

  it('should be able to create organization', async () => {
    const { organization } = await sut.execute({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password: '123456',
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 3456789',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should create a hash of the password', async () => {
    const { organization } = await sut.execute({
      name: 'John Doe Organization',
      email: 'johndoe@example.com',
      password: '123456',
      cep: ' 12345678',
      address: 'John Doe Street',
      phone: '12 3456789',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      organization.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
