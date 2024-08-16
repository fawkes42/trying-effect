import { ParseResult, Schema } from '@effect/schema'
import { Config, Context, Effect } from 'effect'
import type { ConfigError } from 'effect/ConfigError'
import { FetchError, JsonError } from './errors'
import { Pokemon } from './schemas'

interface PokeApiImpl {
    readonly getPokemon: Effect.Effect<
        Pokemon,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >
}

export class PokeApi extends Context.Tag('PokeApi')<PokeApi, PokeApiImpl>() {
    static readonly Live = PokeApi.of({
        getPokemon: Effect.gen(function* () {
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
        }),
    })

    static readonly Test = PokeApi.of({
        getPokemon: Effect.gen(function* () {
            const response = yield* Effect.tryPromise({
                try: () =>
                    fetch(`http://localhost:3000/api/v2/pokemon/garchomp/`),
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
        }),
    })
}
