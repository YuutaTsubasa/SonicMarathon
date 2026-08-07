import { describe, it, expect } from 'vitest';
import { createSonicGame } from '../../src/domain/sonicGame.ts';
import type { RawSonicGameInput, RawMarathonLevelInput, SonicGame } from '../../src/domain/sonicGame.ts';
import { sonic1Input, sonic2Input } from '../../src/domain/initialData.ts';

const validInput = (overrides: Partial<RawSonicGameInput> = {}): RawSonicGameInput => ({
    id: 'test-game',
    slug: 'test',
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
        {
            level: 2,
            title: 'Level 2',
            description: 'Second level',
            conditions: [{ type: 'clear-mode', mode: 'classic' }],
        },
    ],
    ...overrides,
});

const assertReadonlyType = (game: SonicGame): void => {
    // @ts-expect-error — SonicGame is Readonly; direct property assignment must not compile
    game.title = 'mutated';
    // @ts-expect-error — nested arrays are readonly; push must not compile
    game.levels.push({ level: 3, title: '', description: '', conditions: [] });
};

describe('createSonicGame', () => {
    it('Given a valid Sonic game, when it is created, then the domain object is returned successfully', () => {
        const result = createSonicGame(validInput());
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.id).toBe('test-game');
            expect(result.value.slug).toBe('test');
        }
    });

    it('Given levels 1, 2, 4, when game creation is attempted, then validation fails because Level 3 is missing', () => {
        const levels: readonly RawMarathonLevelInput[] = [
            { level: 1, title: 'L1', description: '', conditions: [] },
            { level: 2, title: 'L2', description: '', conditions: [] },
            { level: 4, title: 'L4', description: '', conditions: [] },
        ];
        const result = createSonicGame(validInput({ levels }));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/3/);
        }
    });

    it('Given duplicate Level 2, when game creation is attempted, then validation fails', () => {
        const levels: readonly RawMarathonLevelInput[] = [
            { level: 1, title: 'L1', description: '', conditions: [] },
            { level: 2, title: 'L2a', description: '', conditions: [] },
            { level: 2, title: 'L2b', description: '', conditions: [] },
        ];
        const result = createSonicGame(validInput({ levels }));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/[Dd]uplicate/);
        }
    });

    it('Given the same duplicated level repeated more than twice, when validation fails, then the duplicate list is de-duplicated', () => {
        const levels: readonly RawMarathonLevelInput[] = [
            { level: 1, title: 'L1', description: '', conditions: [] },
            { level: 2, title: 'L2a', description: '', conditions: [] },
            { level: 2, title: 'L2b', description: '', conditions: [] },
            { level: 2, title: 'L2c', description: '', conditions: [] },
        ];
        const result = createSonicGame(validInput({ levels }));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Duplicate level numbers found: 2.');
        }
    });

    it('Given an out-of-range level number, when game creation is attempted, then validation fails', () => {
        const levels: readonly RawMarathonLevelInput[] = [
            { level: 0, title: 'L0', description: '', conditions: [] },
        ];
        const result = createSonicGame(validInput({ levels }));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/[Ii]nvalid level/);
        }
    });

    it('Given a game with no recommended version, when game creation is attempted, then validation fails', () => {
        const result = createSonicGame(validInput({ recommendedVersion: '' }));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/recommendedVersion/);
        }
    });

    it('Given Sonic 1 data, when domain validation runs, then all five Marathon Levels are valid', () => {
        const result = createSonicGame(sonic1Input);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.levels).toHaveLength(5);
            const levelNumbers = result.value.levels.map(l => l.level);
            expect(levelNumbers).toEqual([1, 2, 3, 4, 5]);
        }
    });

    it('Given Sonic 2 data, when domain validation runs, then all five Marathon Levels are valid', () => {
        const result = createSonicGame(sonic2Input);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.levels).toHaveLength(5);
            const levelNumbers = result.value.levels.map(l => l.level);
            expect(levelNumbers).toEqual([1, 2, 3, 4, 5]);
        }
    });

    it('Levels are sorted by level number in the returned domain object', () => {
        const levels: readonly RawMarathonLevelInput[] = [
            { level: 2, title: 'L2', description: '', conditions: [] },
            { level: 1, title: 'L1', description: '', conditions: [] },
        ];
        const result = createSonicGame(validInput({ levels }));
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.levels[0]?.level).toBe(1);
            expect(result.value.levels[1]?.level).toBe(2);
        }
    });

    it('Returned domain object is not affected by later raw-input mutations', () => {
        const input = validInput();
        const result = createSonicGame(input);
        expect(result.ok).toBe(true);
        if (result.ok) {
            (input.platforms as string[])[0] = 'ps5';
            (input.assets.logo as { src: string }).src = '/mutated-logo.png';
            (input.assets.screenshots as { src: string; alt: string }[]).push({
                src: '/extra.png',
                alt: 'extra',
            });
            (input.levels[0]!.conditions as { type: 'clear-mode'; mode: 'anniversary' | 'classic' }[])[0] = {
                type: 'clear-mode',
                mode: 'classic',
            };

            expect(result.value.platforms).toEqual(['pc']);
            expect(result.value.assets.logo.src).toBe('/logo.png');
            expect(result.value.assets.screenshots).toEqual([]);
            expect(result.value.levels[0]?.conditions[0]).toEqual({
                type: 'clear-mode',
                mode: 'anniversary',
            });
        }
    });

    it('Given a non-empty invalid recommended version, when game creation is attempted, then validation fails', () => {
        const result = createSonicGame(validInput({ recommendedVersion: 'invalid-version' }));
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toMatch(/not a valid version/);
        }
    });

    it('SonicGame readonly type assertions are compile-time checked', () => {
        const result = createSonicGame(validInput());
        expect(result.ok).toBe(true);
        if (!result.ok) {
            throw new Error(`Expected successful domain creation: ${result.error}`);
        }
        expect(result.value.id).toBe('test-game');
    });
});
