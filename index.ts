import express from 'express'
import { env } from './src/env'

const app = express()

app.use(express.json())

const PORT = env.NODE_ENV === 'production' ? 3000 : 4200

const httpServer = app.listen(PORT, async () => {
    console.log(`✔✔✔✔✔✔ Working at PORT: ${PORT} ✔✔✔✔✔✔`)
})