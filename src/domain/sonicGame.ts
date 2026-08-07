export type GameId = string;
export type GameSlug = string;

export type GameEra =
    | 'classic'
    | 'adventure'
    | 'boost'
    | 'modern'
    | 'spin-off';

export type Platform =
    | 'mega-drive'
    | 'genesis'
    | 'game-gear'
    | 'master-system'
    | 'pc'
    | 'nintendo-switch'
    | 'ps4'
    | 'ps5'
    | 'xbox-one'
    | 'xbox-series'
    | 'ios'
    | 'android';

export type GameVersion =
    | 'sonic-origins'
    | 'sonic-origins-plus'
    | 'mega-drive'
    | 'genesis'
    | 'game-gear'
    | 'master-system';

export type ImageAssetRef = Readonly<{
    src: string;
    alt: string;
}>;

export type GameAssets = Readonly<{
    logo: ImageAssetRef;
    heroImage: ImageAssetRef;
    screenshots: readonly ImageAssetRef[];
}>;

export type ClearModeCondition = Readonly<{
    type: 'clear-mode';
    mode: 'anniversary' | 'classic';
}>;

export type AllChaosEmeraldsCondition = Readonly<{
    type: 'all-chaos-emeralds';
    mode: 'anniversary' | 'classic';
}>;

export type AllCharactersClearCondition = Readonly<{
    type: 'all-characters-clear';
    mode: 'anniversary' | 'classic';
    includeAllEmeralds: boolean;
}>;

export type AllCharacterCombinationsClearCondition = Readonly<{
    type: 'all-character-combinations-clear';
    mode: 'anniversary' | 'classic';
    includeAllEmeralds: boolean;
}>;

export type CompletePreviousLevelCondition = Readonly<{
    type: 'complete-previous-level';
    level: MarathonLevelNumber;
}>;

export type MarathonCondition =
    | ClearModeCondition
    | AllChaosEmeraldsCondition
    | AllCharactersClearCondition
    | AllCharacterCombinationsClearCondition
    | CompletePreviousLevelCondition;

export type MarathonLevelNumber = 1 | 2 | 3 | 4 | 5;

export type MarathonLevel = Readonly<{
    level: MarathonLevelNumber;
    title: string;
    description: string;
    conditions: readonly MarathonCondition[];
}>;

export type SonicGame = Readonly<{
    id: GameId;
    slug: GameSlug;
    title: string;
    releaseYear: number;
    era: GameEra;
    recommendedVersion: GameVersion;
    platforms: readonly Platform[];
    assets: GameAssets;
    levels: readonly MarathonLevel[];
}>;

export type DomainSuccess<T> = Readonly<{ ok: true; value: T }>;
export type DomainFailure = Readonly<{ ok: false; error: string }>;
export type DomainResult<T> = DomainSuccess<T> | DomainFailure;

const success = <T>(value: T): DomainSuccess<T> => ({ ok: true, value });
const failure = (error: string): DomainFailure => ({ ok: false, error });

export type SonicGameInput = Readonly<{
    id: string;
    slug: string;
    title: string;
    releaseYear: number;
    era: GameEra;
    recommendedVersion: GameVersion | '';
    platforms: readonly Platform[];
    assets: GameAssets;
    levels: readonly MarathonLevel[];
}>;

const VALID_LEVEL_NUMBERS: ReadonlySet<number> = new Set([1, 2, 3, 4, 5]);

const isMarathonLevelNumber = (n: number): n is MarathonLevelNumber =>
    VALID_LEVEL_NUMBERS.has(n);

const validateLevels = (levels: readonly MarathonLevel[]): DomainFailure | null => {
    if (levels.length === 0) {
        return failure('Levels must not be empty.');
    }

    const numbers = levels.map(l => l.level);

    const duplicates = numbers.filter((n, i) => numbers.indexOf(n) !== i);
    if (duplicates.length > 0) {
        return failure(`Duplicate level numbers found: ${duplicates.join(', ')}.`);
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const missingLevel = sorted.reduce<number | null>(
        (acc, num, i) => acc ?? (isMarathonLevelNumber(i + 1) && num !== i + 1 ? i + 1 : null),
        null,
    );
    if (missingLevel !== null) {
        return failure(`Levels must be consecutive starting from 1. Missing level ${missingLevel}.`);
    }

    return null;
};

export const createSonicGame = (input: SonicGameInput): DomainResult<SonicGame> => {
    if (!input.id || input.id.trim() === '') {
        return failure('Game id must not be empty.');
    }

    if (!input.slug || input.slug.trim() === '') {
        return failure('Game slug must not be empty.');
    }

    if (!input.title || input.title.trim() === '') {
        return failure('Game title must not be empty.');
    }

    if (!input.recommendedVersion) {
        return failure('Game recommendedVersion must be specified.');
    }

    const levelError = validateLevels(input.levels);
    if (levelError !== null) {
        return levelError;
    }

    const game: SonicGame = {
        id: input.id,
        slug: input.slug,
        title: input.title,
        releaseYear: input.releaseYear,
        era: input.era,
        recommendedVersion: input.recommendedVersion,
        platforms: input.platforms,
        assets: input.assets,
        levels: [...input.levels].sort((a, b) => a.level - b.level),
    };

    return success(game);
};
