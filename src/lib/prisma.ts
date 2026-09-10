import { PrismaClient } from '@prisma/client'
import path from 'path';

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`
        }
      }
    });
  }
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
