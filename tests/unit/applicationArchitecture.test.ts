import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const APPLICATION_SOURCE_PATHS = [
    'src/application/getGameDetail.ts',
    'src/application/getTimelineGames.ts',
] as const;

const FORBIDDEN_APPLICATION_DEPENDENCIES = [
    'svelte',
    'initialData',
    'staticSonicGameRepository',
] as const;

const readApplicationSources = (): readonly string[] =>
    APPLICATION_SOURCE_PATHS.map(path => readFileSync(resolve(process.cwd(), path), 'utf8'));

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
