import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ResgisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new ResgisterUseCase(usersRepository)

  return registerUseCase
}
