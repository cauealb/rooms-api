import { app } from "./app.ts";
import { env } from './src/env/index.ts'

app.listen({
    port: env.PORT,
    host: '0.0.0.0'
})
.then(() => console.log("Servidor iniciando com sucesso!"))
.catch((ex) => {
    console.log(ex)
})