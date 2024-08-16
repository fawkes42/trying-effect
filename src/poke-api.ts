import type { ParseResult } from '@effect/schema'
import { Context, Effect } from 'effect'
import type { ConfigError } from 'effect/ConfigError'
import type { FetchError, JsonError } from './errors'
import type { Pokemon } from './schemas'

export interface PokeApi {
    readonly getPokemon: Effect.Effect<
        typeof Pokemon.Type,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >
}

export const PokeApi = Context.GenericTag<PokeApi>('PokeApi')
