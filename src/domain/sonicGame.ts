import {
    createDomainFailure,
    createDomainSuccess,
    isDomainFailure,
    type DomainFailure,
    type DomainResult,
} from './domainResult.ts';

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

const VALID_LEVEL_NUMBERS = [1, 2, 3, 4, 5] as const;

export type MarathonLevelNumber = (typeof VALID_LEVEL_NUMBERS)[number];

const VALID_LEVEL_NUMBER_SET: ReadonlySet<number> = new Set(VALID_LEVEL_NUMBERS);

const isMarathonLevelNumber = (n: number): n is MarathonLevelNumber =>
    VALID_LEVEL_NUMBER_SET.has(n);

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

const cloneCondition = (condition: MarathonCondition): MarathonCondition => ({ ...condition });

const cloneAssetRef = (asset: ImageAssetRef): ImageAssetRef => ({ ...asset });

const cloneAssets = (assets: GameAssets): GameAssets => ({
    logo: cloneAssetRef(assets.logo),
    heroImage: cloneAssetRef(assets.heroImage),
    screenshots: assets.screenshots.map(cloneAssetRef),
});

export type RawMarathonLevelInput = Readonly<{
    level: number;
    title: string;
    description: string;
    conditions: readonly MarathonCondition[];
}>;

export type RawSonicGameInput = Readonly<{
    id: string;
    slug: string;
    title: string;
    releaseYear: number;
    era: GameEra;
    recommendedVersion: string;
    platforms: readonly Platform[];
    assets: GameAssets;
    levels: readonly RawMarathonLevelInput[];
}>;

const VALID_GAME_VERSIONS = [
    'sonic-origins',
    'sonic-origins-plus',
    'mega-drive',
    'genesis',
    'game-gear',
    'master-system',
] as const satisfies readonly GameVersion[];

const VALID_GAME_VERSION_SET: ReadonlySet<string> = new Set(VALID_GAME_VERSIONS);

const isGameVersion = (s: string): s is GameVersion => VALID_GAME_VERSION_SET.has(s);

const parseMarathonLevel = (raw: RawMarathonLevelInput): DomainResult<MarathonLevel> => {
    if (!isMarathonLevelNumber(raw.level)) {
        return createDomainFailure(
            `Invalid level number: ${raw.level}. Must be one of ${VALID_LEVEL_NUMBERS.join(', ')}.`,
        );
    }
    return createDomainSuccess({
        level: raw.level,
        title: raw.title,
        description: raw.description,
        conditions: raw.conditions.map(cloneCondition),
    });
};

const validateLevels = (levels: readonly MarathonLevel[]): DomainFailure | null => {
    const numbers = levels.map(l => l.level);

    const duplicates = [...new Set(numbers.filter((n, i) => numbers.indexOf(n) !== i))];
    if (duplicates.length > 0) {
        return createDomainFailure(`Duplicate level numbers found: ${duplicates.join(', ')}.`);
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const missingIndex = sorted.findIndex((num, i) => num !== i + 1);
    if (missingIndex !== -1) {
        return createDomainFailure(
            `Levels must be consecutive starting from 1. Missing level ${missingIndex + 1}.`,
        );
    }

    return null;
};

export const createSonicGame = (input: RawSonicGameInput): DomainResult<SonicGame> => {
    if (!input.id || input.id.trim() === '') {
        return createDomainFailure('Game id must not be empty.');
    }

    if (!input.slug || input.slug.trim() === '') {
        return createDomainFailure('Game slug must not be empty.');
    }

    if (!input.title || input.title.trim() === '') {
        return createDomainFailure('Game title must not be empty.');
    }

    if (!input.recommendedVersion || input.recommendedVersion.trim() === '') {
        return createDomainFailure('Game recommendedVersion must be specified.');
    }

    if (!isGameVersion(input.recommendedVersion)) {
        return createDomainFailure(
            `Game recommendedVersion '${input.recommendedVersion}' is not a valid version.`,
        );
    }

    if (input.levels.length === 0) {
        return createDomainFailure('Levels must not be empty.');
    }

    const levelResults = input.levels.map(parseMarathonLevel);
    const firstFailure = levelResults.find(isDomainFailure);
    if (firstFailure !== undefined) {
        return firstFailure;
    }

    const parsedLevels = levelResults.flatMap(r => (r.ok ? [r.value] : []));
    const levelError = validateLevels(parsedLevels);
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
        platforms: [...input.platforms],
        assets: cloneAssets(input.assets),
        levels: [...parsedLevels].sort((a, b) => a.level - b.level),
    };

    return createDomainSuccess(game);
};
