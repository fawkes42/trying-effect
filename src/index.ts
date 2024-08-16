import { Schema } from '@effect/schema'
import { Config, Effect } from 'effect'
import { FetchError, JsonError } from './errors'
import { Pokemon } from './schemas'

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
