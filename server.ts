import { app } from "./app.ts";

app.listen({
    port: 3434,
    host: '0.0.0.0'
})
.then(() => console.log("Servidor iniciando com sucesso!"))
.catch((ex) => {
    console.log(ex)
})