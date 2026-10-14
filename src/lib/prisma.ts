import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = process.env.DATABASE_URL

if(!connectionString) {
    throw new Error('DATABASE_URL não foi definida no .env')
}

// O driver adapter do pg ignora o `?schema=` da URL, então o schema precisa ser
// passado explicitamente. Usado pelos testes e2e para isolar cada arquivo.
const schema = process.env.DATABASE_SCHEMA

const adapter = schema
    ? new PrismaPg({ connectionString }, { schema })
    : new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })
