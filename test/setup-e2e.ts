import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll } from 'vitest'

// Carregado antes do grafo de módulos do teste, então `src/env` e `src/lib/prisma`
// já enxergam as variáveis de teste. Variáveis já presentes no processo (CI) vencem.
config({ path: '.env.test' })

// Cada arquivo de teste roda em um schema exclusivo do Postgres, criado antes e
// derrubado depois. Isso deixa os arquivos independentes e paralelizáveis.
const schema = `test_${randomUUID().replaceAll('-', '')}`

function buildDatabaseUrl(schema: string) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error('DATABASE_URL não foi definida no .env.test')
    }

    const databaseUrl = new URL(connectionString)
    databaseUrl.searchParams.set('schema', schema)

    return databaseUrl.toString()
}

process.env.DATABASE_URL = buildDatabaseUrl(schema)
process.env.DATABASE_SCHEMA = schema

beforeAll(() => {
    try {
        execSync('npx prisma migrate deploy', { stdio: 'pipe' })
    } catch (ex) {
        const { stdout, stderr } = ex as { stdout?: Buffer; stderr?: Buffer }

        throw new Error(
            `Falha ao aplicar as migrations no schema "${schema}". ` +
            `O banco de teste está no ar? (npm run test:e2e:db)\n` +
            `${stdout?.toString() ?? ''}\n${stderr?.toString() ?? ''}`
        )
    }
})

afterAll(async () => {
    // Import dinâmico: o client só pode ser criado depois que a DATABASE_URL do
    // schema já está no process.env.
    const { prisma } = await import('../src/lib/prisma.ts')

    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
    await prisma.$disconnect()
})
