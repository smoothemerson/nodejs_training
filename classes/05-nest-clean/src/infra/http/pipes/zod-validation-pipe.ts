import { BadRequestException, type PipeTransform } from '@nestjs/common'
import { ZodError, z } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: z.treeifyError(error),
          message: 'Validation failed',
          statusCode: 400,
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
