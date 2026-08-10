import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const PRESENTATION_SOURCE_URLS = [
    new URL('../../src/ui/components/Timeline.svelte', import.meta.url),
    new URL('../../src/ui/routes/HomePage.svelte', import.meta.url),
] as const;
const FORBIDDEN_PRESENTATION_DEPENDENCIES = [
    'initialData',
    'staticSonicGameRepository',
] as const;

const readPresentationSources = (): readonly string[] =>
    PRESENTATION_SOURCE_URLS.map(url => readFileSync(url, 'utf8'));

const containsForbiddenDependency = (source: string): boolean =>
    FORBIDDEN_PRESENTATION_DEPENDENCIES.some(dependency => source.includes(dependency));

describe('Presentation architecture', () => {
    it('does not import raw static data or the static repository implementation', () => {
        expect(readPresentationSources().some(containsForbiddenDependency)).toBe(false);
    });
});
