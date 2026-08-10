import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const PRESENTATION_SOURCE_PATHS = [
    'src/ui/components/Timeline.svelte',
    'src/ui/routes/HomePage.svelte',
] as const;
const FORBIDDEN_PRESENTATION_DEPENDENCIES = [
    'initialData',
    'staticSonicGameRepository',
] as const;

const readPresentationSources = (): readonly string[] =>
    PRESENTATION_SOURCE_PATHS.map(path => readFileSync(resolve(process.cwd(), path), 'utf8'));

const containsForbiddenDependency = (source: string): boolean =>
    FORBIDDEN_PRESENTATION_DEPENDENCIES.some(dependency => source.includes(dependency));

describe('Presentation architecture', () => {
    it('does not import raw static data or the static repository implementation', () => {
        expect(readPresentationSources().some(containsForbiddenDependency)).toBe(false);
    });
});
