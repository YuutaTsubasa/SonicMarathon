import { describe, expect, it } from 'vitest';

import { sonic1Input, sonic2Input } from '../../src/domain/initialData.ts';
import type { RawSonicGameInput, SonicGame } from '../../src/domain/sonicGame.ts';
import {
    createStaticSonicGameRepository,
    staticSonicGameRepository,
} from '../../src/infrastructure/staticSonicGameRepository.ts';

const validInput = (overrides: Partial<RawSonicGameInput> = {}): RawSonicGameInput => ({
    id: 'test-game',
    slug: 'test-game',
    title: 'Test Game',
    releaseYear: 2000,
    era: 'classic',
    recommendedVersion: 'sonic-origins',
    platforms: ['pc'],
    assets: {
        logo: { src: '/logo.png', alt: 'logo' },
        heroImage: { src: '/hero.png', alt: 'hero' },
        screenshots: [],
    },
    levels: [
        {
            level: 1,
            title: 'Level 1',
            description: 'First level',
            conditions: [{ type: 'clear-mode', mode: 'anniversary' }],
        },
    ],
    ...overrides,
});

describe('StaticSonicGameRepository', () => {
    it('Given Sonic 1 and Sonic 2 static data, when the default repository is used, then both games are available as valid SonicGame values', () => {
        const games = staticSonicGameRepository.getAll();

        expect(games).toHaveLength(2);
        expect(games.map(game => game.id)).toEqual([sonic1Input.id, sonic2Input.id]);
    });

    it('Given games in arbitrary input order, when getAll is called, then games are returned in release-year order', () => {
        const result = createStaticSonicGameRepository([validInput(), sonic2Input, sonic1Input]);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            throw new Error(`Expected repository creation to succeed: ${result.error}`);
        }

        expect(result.value.getAll().map(game => game.releaseYear)).toEqual([1991, 1992, 2000]);
    });

    it('Given Sonic 1 id, when findById is called, then Sonic 1 is returned', () => {
        const result = staticSonicGameRepository.findById(sonic1Input.id);

        expect(result).toEqual({
            type: 'found',
            game: expect.objectContaining({ id: sonic1Input.id, slug: sonic1Input.slug }),
        });
    });

    it('Given Sonic 2 slug, when findBySlug is called, then Sonic 2 is returned', () => {
        const result = staticSonicGameRepository.findBySlug(sonic2Input.slug);

        expect(result).toEqual({
            type: 'found',
            game: expect.objectContaining({ id: sonic2Input.id, slug: sonic2Input.slug }),
        });
    });

    it('Given an unknown id, when findById is called, then an explicit not-found result is returned', () => {
        expect(staticSonicGameRepository.findById('unknown-game')).toEqual({ type: 'not-found' });
    });

    it('Given an unknown slug, when findBySlug is called, then an explicit not-found result is returned', () => {
        expect(staticSonicGameRepository.findBySlug('unknown-slug')).toEqual({ type: 'not-found' });
    });

    it('Given duplicate game ids, when repository creation is attempted, then creation fails explicitly', () => {
        const result = createStaticSonicGameRepository([
            validInput({ id: 'duplicate-id', slug: 'first-game' }),
            validInput({ id: 'duplicate-id', slug: 'second-game' }),
        ]);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/Duplicate game ids found: duplicate-id\./);
        }
    });

    it('Given duplicate game slugs, when repository creation is attempted, then creation fails explicitly', () => {
        const result = createStaticSonicGameRepository([
            validInput({ id: 'first-game', slug: 'duplicate-slug' }),
            validInput({ id: 'second-game', slug: 'duplicate-slug' }),
        ]);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/Duplicate game slugs found: duplicate-slug\./);
        }
    });

    it('Given invalid raw game data, when repository creation is attempted, then the domain parse failure is surfaced explicitly', () => {
        const result = createStaticSonicGameRepository([
            validInput({ recommendedVersion: 'invalid-version' }),
        ]);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/not a valid version/);
        }
    });

    it('Given the result of getAll, callers cannot mutate repository-owned state through the returned type', () => {
        const initialGames = staticSonicGameRepository.getAll();
        const secondRead = staticSonicGameRepository.getAll();

        expect(initialGames).not.toBe(secondRead);

        const assertReadonlyType = (games: readonly SonicGame[]): void => {
            // @ts-expect-error — repository exposes a readonly collection
            games.push(secondRead[0]!);
        };

        void assertReadonlyType;
    });
});
