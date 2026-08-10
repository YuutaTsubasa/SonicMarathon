import { describe, expect, it } from 'vitest';

import { createGetGameDetail } from '../../src/application/getGameDetail.ts';
import { createGetTimelineGames } from '../../src/application/getTimelineGames.ts';
import type { SonicGame } from '../../src/domain/sonicGame.ts';
import type { FindGameResult, SonicGameRepository } from '../../src/domain/sonicGameRepository.ts';

const createGame = (
    id: string,
    slug: string,
    title: string,
    releaseYear: number,
): SonicGame => ({
    id,
    slug,
    title,
    releaseYear,
    era: 'classic',
    recommendedVersion: 'sonic-origins',
    platforms: ['pc'],
    assets: {
        logo: { src: `/${slug}-logo.png`, alt: `${title} logo` },
        heroImage: { src: `/${slug}-hero.png`, alt: `${title} hero` },
        screenshots: [],
    },
    levels: [
        {
            level: 1,
            title: 'Level 1',
            description: 'Clear anniversary mode',
            conditions: [{ type: 'clear-mode', mode: 'anniversary' }],
        },
    ],
});

const sonic1 = createGame('sonic-1', 'sonic-the-hedgehog', 'Sonic the Hedgehog', 1991);
const sonic2 = createGame('sonic-2', 'sonic-the-hedgehog-2', 'Sonic the Hedgehog 2', 1992);
const repositoryGames = [sonic1, sonic2] as const;
const NOT_FOUND_RESULT: FindGameResult = { type: 'not-found' };

const fakeRepository: SonicGameRepository = {
    getAll: () => repositoryGames,
    findById: id => {
        const game = repositoryGames.find(candidate => candidate.id === id);
        return game === undefined ? NOT_FOUND_RESULT : { type: 'found', game };
    },
    findBySlug: slug => {
        const game = repositoryGames.find(candidate => candidate.slug === slug);
        return game === undefined ? NOT_FOUND_RESULT : { type: 'found', game };
    },
};

describe('Application queries', () => {
    it('Given a repository containing Sonic 1 and Sonic 2, when timeline query runs, then both games are returned in repository-defined order', () => {
        const getTimelineGames = createGetTimelineGames(fakeRepository);

        expect(getTimelineGames()).toEqual(repositoryGames);
    });

    it('Given a repository that returns a readonly game collection, when timeline query runs, then the query does not mutate or re-sort it', () => {
        const repositoryOrder = Object.freeze([sonic2, sonic1] as const);
        const repository: SonicGameRepository = {
            ...fakeRepository,
            getAll: () => repositoryOrder,
        };
        const getTimelineGames = createGetTimelineGames(repository);

        expect(getTimelineGames()).toEqual(repositoryOrder);
    });

    it('Given Sonic 1 slug, when game detail query runs, then Sonic 1 is returned', () => {
        const getGameDetail = createGetGameDetail(fakeRepository);

        expect(getGameDetail(sonic1.slug)).toEqual({ type: 'found', game: sonic1 });
    });

    it('Given Sonic 2 slug, when game detail query runs, then Sonic 2 is returned', () => {
        const getGameDetail = createGetGameDetail(fakeRepository);

        expect(getGameDetail(sonic2.slug)).toEqual({ type: 'found', game: sonic2 });
    });

    it('Given an unknown slug, when game detail query runs, then an explicit not-found result is returned', () => {
        const getGameDetail = createGetGameDetail(fakeRepository);

        expect(getGameDetail('unknown-game')).toEqual({ type: 'not-found' });
    });

    it('Given a fake repository, when use cases are tested, then no static infrastructure implementation is required', () => {
        const getTimelineGames = createGetTimelineGames(fakeRepository);
        const getGameDetail = createGetGameDetail(fakeRepository);

        expect(getTimelineGames()).toHaveLength(2);
        expect(getGameDetail(sonic1.slug).type).toBe('found');
    });
});
