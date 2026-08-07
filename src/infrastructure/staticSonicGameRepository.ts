import { sonic1Input, sonic2Input } from '../domain/initialData.ts';
import type { FindGameResult, SonicGameRepository } from '../domain/sonicGameRepository.ts';
import {
    createDomainFailure,
    createDomainSuccess,
    isDomainFailure,
    type DomainFailure,
    type DomainResult,
} from '../domain/domainResult.ts';
import { createSonicGame, type RawSonicGameInput, type SonicGame } from '../domain/sonicGame.ts';

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

    return createDomainFailure(`${errorPrefix}${duplicates.join(', ')}.`);
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

    return createDomainSuccess({
        game: result.value,
        inputOrder,
    });
};

const collectSortableGames = (
    parsedGameResults: readonly DomainResult<SortableGame>[],
): DomainResult<readonly SortableGame[]> => {
    const firstFailure = parsedGameResults.find(isDomainFailure);
    if (firstFailure !== undefined) {
        return firstFailure;
    }

    return createDomainSuccess(parsedGameResults.flatMap(result => (result.ok ? [result.value] : [])));
};

const copyGames = (games: readonly SonicGame[]): readonly SonicGame[] => [...games];

const createRepository = (games: readonly SonicGame[]): StaticSonicGameRepository => ({
    getAll: () => copyGames(games),
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
    const sortableGamesResult = collectSortableGames(inputs.map(parseGame));
    if (!sortableGamesResult.ok) {
        return sortableGamesResult;
    }

    const sortableGames = sortableGamesResult.value;
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

    const games = [...sortableGames].sort(compareSortableGames).map(entry => entry.game);
    return createDomainSuccess(createRepository(games));
};

const createDefaultStaticSonicGameRepository = (): StaticSonicGameRepository => {
    const result = createStaticSonicGameRepository(DEFAULT_STATIC_GAME_INPUTS);
    if (!result.ok) {
        throw new Error(`${DEFAULT_REPOSITORY_ERROR_PREFIX}${result.error}`);
    }

    return result.value;
};

export const staticSonicGameRepository = createDefaultStaticSonicGameRepository();
