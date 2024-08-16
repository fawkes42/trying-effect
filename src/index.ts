import { Schema } from '@effect/schema'
import { Config, Data, Effect } from 'effect'
import express from 'express'
import { env } from '../src/env'

const app = express()

app.use(express.json())

const PORT = env.NODE_ENV === 'production' ? 3000 : 4200

app.listen(PORT, async () => {
    console.log(`✔✔✔✔✔✔ Working at PORT: ${PORT} ✔✔✔✔✔✔`)
})

class FetchError extends Data.TaggedError('FetchError') {}

class JsonError extends Data.TaggedError('JsonError') {}

class Pokemon extends Schema.Class<Pokemon>('Pokemon')({
    id: Schema.Number,
    order: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
}) {}

const getPokemon = Effect.gen(function* () {
    const baseUrl = yield* Config.string('BASE_URL')

    const response = yield* Effect.tryPromise({
        try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
        catch: () => new FetchError(),
    })

    if (!response.ok) {
        return yield* new FetchError()
    }

    const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
    })

    return yield* Schema.decodeUnknown(Pokemon)(json)
})

const main = getPokemon.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed('Fetch error'),
        JsonError: () => Effect.succeed('Json error'),
        ParseError: () => Effect.succeed('Parse error'),
    }),
)

Effect.runPromise(main).then((result) => {
    console.log(result)
})
