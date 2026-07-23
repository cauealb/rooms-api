import fastify from "fastify";
export const app = fastify()

app.setErrorHandler((err, request, reply) => {
    if(app instanceof Error) {
        return reply.status(400).send({
            message: 'Internal server error'
        }) // TODO: refatorar isso com erros criados
    }

    return reply.status(500).send({
        message: 'Internal server error'
    })
})

