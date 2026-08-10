import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import type { GetTimelineGames } from '../../src/application/getTimelineGames.ts';
import type { SonicGame } from '../../src/domain/sonicGame.ts';
import HomePage from '../../src/ui/routes/HomePage.svelte';

const games: readonly SonicGame[] = [
    {
        id: 'sonic-1',
        slug: 'sonic-1',
        title: 'Sonic the Hedgehog',
        releaseYear: 1991,
        era: 'classic',
        recommendedVersion: 'sonic-origins',
        platforms: ['pc'],
        assets: {
            logo: { src: '/assets/sonic-1/logo.png', alt: 'Sonic the Hedgehog logo' },
            heroImage: { src: '/assets/sonic-1/hero.png', alt: 'Sonic the Hedgehog hero image' },
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
    },
];

describe('HomePage', () => {
    it('gets timeline data through the Application query and renders it', () => {
        const getTimelineGames = vi.fn<GetTimelineGames>(() => games);

        render(HomePage, { getTimelineGames });

        expect(getTimelineGames).toHaveBeenCalledOnce();
        expect(screen.getByRole('img', { name: 'Sonic the Hedgehog logo' })).toBeInTheDocument();
        expect(screen.getByText('1991')).toBeInTheDocument();
    });
});
