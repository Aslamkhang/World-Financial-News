import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

function createPrisma() {
  if (!process.env.DATABASE_URL) return null
  try {
    const libsql = createClient({ url: process.env.DATABASE_URL })
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
  } catch {
    return null
  }
}

export const prisma = createPrisma()
