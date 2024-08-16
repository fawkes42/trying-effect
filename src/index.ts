import { Console, Effect } from 'effect'
import express from 'express'
import { env } from '../src/env'

const app = express()

app.use(express.json())

const PORT = env.NODE_ENV === 'production' ? 3000 : 4200

app.listen(PORT, async () => {
    console.log(`✔✔✔✔✔✔ Working at PORT: ${PORT} ✔✔✔✔✔✔`)
})

/// Effect<Response, UnknownException>
const fetchRequest = Effect.tryPromise(() =>
    fetch('https://pokeapi.co/api/v2/pokemon/garchomp/'),
)

/// Effect<unknown, UnknownException>
const jsonResponse = (response: Response) =>
    Effect.tryPromise(() => response.json())

/// Effect<unknown, UnknownException>
const main = Effect.flatMap(fetchRequest, jsonResponse)
