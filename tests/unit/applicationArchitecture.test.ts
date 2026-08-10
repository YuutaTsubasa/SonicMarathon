import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const APPLICATION_SOURCE_URLS = [
    new URL('../../src/application/getGameDetail.ts', import.meta.url),
    new URL('../../src/application/getTimelineGames.ts', import.meta.url),
] as const;

const FORBIDDEN_APPLICATION_DEPENDENCIES = [
    'svelte',
    'initialData',
    'staticSonicGameRepository',
] as const;

const readApplicationSources = (): readonly string[] =>
    APPLICATION_SOURCE_URLS.map(url => readFileSync(url, 'utf8'));

const containsForbiddenDependency = (source: string): boolean =>
    source
        .split('\n')
        .filter(line => line.trimStart().startsWith('import'))
        .some(line => FORBIDDEN_APPLICATION_DEPENDENCIES.some(dependency => line.includes(dependency)));

describe('Application architecture', () => {
    it('Given the Application source files, they do not import Svelte, initialData, or staticSonicGameRepository', () => {
        const sources = readApplicationSources();

        expect(sources.some(containsForbiddenDependency)).toBe(false);
    });
});
