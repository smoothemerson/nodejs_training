import type { Prisma, User } from '@prisma/client'
import type { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public itens: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.itens.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.itens.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
