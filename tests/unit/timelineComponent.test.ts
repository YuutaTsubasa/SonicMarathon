import { render, screen, within } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import type { SonicGame } from '../../src/domain/sonicGame.ts';
import Timeline from '../../src/ui/components/Timeline.svelte';

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
        logo: { src: `/assets/${slug}/logo.png`, alt: `${title} logo` },
        heroImage: { src: `/assets/${slug}/hero.png`, alt: `${title} hero image` },
        screenshots: [],
    },
    levels: [
        {
            level: 1,
            title: 'Clear game',
            description: 'Clear anniversary mode',
            conditions: [{ type: 'clear-mode', mode: 'anniversary' }],
        },
    ],
});

const sonic1 = createGame('sonic-1', 'sonic-1', 'Sonic the Hedgehog', 1991);
const sonic2 = createGame('sonic-2', 'sonic-2', 'Sonic the Hedgehog 2', 1992);

describe('Timeline', () => {
    it('renders Sonic 1 and Sonic 2 in the supplied Application order', () => {
        render(Timeline, { games: [sonic2, sonic1] });

        const nodes = screen.getAllByRole('button');
        expect(nodes).toHaveLength(2);
        expect(nodes[0]).toHaveAccessibleName('View Sonic the Hedgehog 2');
        expect(nodes[1]).toHaveAccessibleName('View Sonic the Hedgehog');
    });

    it('renders each release year and Domain logo alt text', () => {
        render(Timeline, { games: [sonic1, sonic2] });

        expect(screen.getByText('1991')).toBeInTheDocument();
        expect(screen.getByText('1992')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Sonic the Hedgehog logo' })).toHaveAttribute(
            'src',
            '/assets/sonic-1/logo.png',
        );
        expect(screen.getByRole('img', { name: 'Sonic the Hedgehog 2 logo' })).toHaveAttribute(
            'src',
            '/assets/sonic-2/logo.png',
        );
    });

    it('uses one ordered horizontal track inside a horizontally scrollable timeline container', () => {
        render(Timeline, { games: [sonic1, sonic2] });

        const timeline = screen.getByTestId('timeline');
        const track = within(timeline).getByRole('list');

        expect(timeline).toHaveClass('timeline');
        expect(track).toHaveClass('timeline__track');
        expect(within(track).getAllByRole('listitem')).toHaveLength(2);
    });
});
