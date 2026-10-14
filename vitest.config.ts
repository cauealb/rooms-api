import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['src/module/**/tests/**/*.spec.ts'],
                    environment: 'node',
                },
            },
            {
                test: {
                    name: 'e2e',
                    include: ['src/http/**/*.e2e-spec.ts'],
                    environment: 'node',
                    setupFiles: ['./test/setup-e2e.ts'],
                    // `prisma migrate deploy` roda uma vez por arquivo de teste.
                    hookTimeout: 60_000,
                    testTimeout: 30_000,
                },
            },
        ],
    },
})
