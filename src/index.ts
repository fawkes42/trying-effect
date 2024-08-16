import { Console, Effect } from 'effect'
import express from 'express'
import { env } from '../src/env'

const app = express()

app.use(express.json())

const PORT = env.NODE_ENV === 'production' ? 3000 : 4200

app.listen(PORT, async () => {
    console.log(`✔✔✔✔✔✔ Working at PORT: ${PORT} ✔✔✔✔✔✔`)
})

interface FetchError {
    readonly _tag: 'FetchError'
}

interface JsonError {
    readonly _tag: 'JsonError'
}

const fetchRequest = Effect.tryPromise({
    try: () => fetch('https://pokeapi.co/api/v2/psadokemon/garchomp/'),
    catch: (): FetchError => ({ _tag: 'FetchError' }),
})

const jsonResponse = (response: Response) =>
    /// 👇 Effect<unknown, JsonError>
    Effect.tryPromise({
        try: () => response.json(),
        catch: (): JsonError => ({ _tag: 'JsonError' }),
    })

const main = fetchRequest.pipe(
    Effect.flatMap(jsonResponse),
    Effect.catchTags({
        FetchError: () => Effect.succeed('Fetch error'),
        JsonError: () => Effect.succeed('Json error'),
    }),
)

Effect.runPromise(main).then((result) => {
    console.log(result)
})
