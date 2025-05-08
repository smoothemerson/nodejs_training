import type { Prisma } from '@prisma/client'
import type { UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUserRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return user
  }
}
