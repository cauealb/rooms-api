import 'dotenv/config.js'
import z from 'zod'

const schemaEnv = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3434),
    JWT_SECRET: z.string()
})

const _env = schemaEnv.safeParse(process.env)

if(!_env.success) {
    const msg = 'Váriaveis de ambiente incorretas!!'

    console.error(msg)
    throw new Error(msg)
}

export const env = _env.data

