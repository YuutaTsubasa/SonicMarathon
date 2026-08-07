import { sonic1Input, sonic2Input } from '../domain/initialData.ts';
import type { FindGameResult, SonicGameRepository } from '../domain/sonicGameRepository.ts';
import { createSonicGame, type DomainFailure, type DomainResult, type DomainSuccess, type RawSonicGameInput, type SonicGame } from '../domain/sonicGame.ts';

const DEFAULT_STATIC_GAME_INPUTS = [sonic1Input, sonic2Input] as const;
const DUPLICATE_GAME_ID_ERROR_PREFIX = 'Duplicate game ids found: ';
const DUPLICATE_GAME_SLUG_ERROR_PREFIX = 'Duplicate game slugs found: ';
const DEFAULT_REPOSITORY_ERROR_PREFIX = 'Failed to initialize static Sonic game repository: ';
const NOT_FOUND_RESULT: FindGameResult = { type: 'not-found' };

type SortableGame = Readonly<{
    game: SonicGame;
    inputOrder: number;
}>;

export type StaticSonicGameRepository = SonicGameRepository;

const success = <T>(value: T): DomainSuccess<T> => ({ ok: true, value });

const failure = (error: string): DomainFailure => ({ ok: false, error });

const createFoundResult = (game: SonicGame): FindGameResult => ({
    type: 'found',
    game,
});

const findDuplicates = (values: readonly string[]): readonly string[] =>
    [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const validateUniqueGameField = (
    values: readonly string[],
    errorPrefix: string,
): DomainFailure | null => {
    const duplicates = findDuplicates(values);
    if (duplicates.length === 0) {
        return null;
    }

    return failure(`${errorPrefix}${duplicates.join(', ')}.`);
};

const compareSortableGames = (left: SortableGame, right: SortableGame): number => {
    if (left.game.releaseYear !== right.game.releaseYear) {
        return left.game.releaseYear - right.game.releaseYear;
    }

    return left.inputOrder - right.inputOrder;
};

const parseGame = (
    input: RawSonicGameInput,
    inputOrder: number,
): DomainResult<SortableGame> => {
    const result = createSonicGame(input);
    if (!result.ok) {
        return result;
    }

    return success({
        game: result.value,
        inputOrder,
    });
};

const createReadonlyGameCollection = (games: readonly SonicGame[]): readonly SonicGame[] => [...games];

const createRepository = (games: readonly SonicGame[]): StaticSonicGameRepository => ({
    getAll: () => createReadonlyGameCollection(games),
    findById: id => {
        const game = games.find(candidate => candidate.id === id);
        if (game === undefined) {
            return NOT_FOUND_RESULT;
        }

        return createFoundResult(game);
    },
    findBySlug: slug => {
        const game = games.find(candidate => candidate.slug === slug);
        if (game === undefined) {
            return NOT_FOUND_RESULT;
        }

        return createFoundResult(game);
    },
});

export const createStaticSonicGameRepository = (
    inputs: readonly RawSonicGameInput[],
): DomainResult<StaticSonicGameRepository> => {
    const parsedGameResults = inputs.map(parseGame);
    const firstFailure = parsedGameResults.find((result): result is DomainFailure => !result.ok);
    if (firstFailure !== undefined) {
        return firstFailure;
    }

    const sortableGames = parsedGameResults.flatMap(result => (result.ok ? [result.value] : []));
    const duplicateIdFailure = validateUniqueGameField(
        sortableGames.map(entry => entry.game.id),
        DUPLICATE_GAME_ID_ERROR_PREFIX,
    );
    if (duplicateIdFailure !== null) {
        return duplicateIdFailure;
    }

    const duplicateSlugFailure = validateUniqueGameField(
        sortableGames.map(entry => entry.game.slug),
        DUPLICATE_GAME_SLUG_ERROR_PREFIX,
    );
    if (duplicateSlugFailure !== null) {
        return duplicateSlugFailure;
    }

    const games = sortableGames.sort(compareSortableGames).map(entry => entry.game);
    return success(createRepository(games));
};

const createDefaultStaticSonicGameRepository = (): StaticSonicGameRepository => {
    const result = createStaticSonicGameRepository(DEFAULT_STATIC_GAME_INPUTS);
    if (!result.ok) {
        throw new Error(`${DEFAULT_REPOSITORY_ERROR_PREFIX}${result.error}`);
    }

    return result.value;
};

export const staticSonicGameRepository = createDefaultStaticSonicGameRepository();
