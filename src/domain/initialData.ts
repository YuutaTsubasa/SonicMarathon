import type { RawSonicGameInput } from './sonicGame.ts';

export const sonic1Input: RawSonicGameInput = {
    id: 'sonic-the-hedgehog-1',
    slug: 'sonic-1',
    title: 'Sonic the Hedgehog',
    releaseYear: 1991,
    era: 'classic',
    recommendedVersion: 'sonic-origins',
    platforms: ['nintendo-switch', 'ps4', 'ps5', 'xbox-one', 'xbox-series', 'pc'],
    assets: {
        logo: { src: '/assets/sonic-1/logo.png', alt: 'Sonic the Hedgehog logo' },
        heroImage: { src: '/assets/sonic-1/hero.png', alt: 'Sonic the Hedgehog hero image' },
        screenshots: [],
    },
    levels: [
        {
            level: 1,
            title: '紀念模式通關',
            description: '以紀念模式完成遊戲',
            conditions: [{ type: 'clear-mode', mode: 'anniversary' }],
        },
        {
            level: 2,
            title: '紀念模式 + 全寶石通關',
            description: '以紀念模式完成遊戲並收集全部混沌寶石',
            conditions: [
                { type: 'clear-mode', mode: 'anniversary' },
                { type: 'all-chaos-emeralds', mode: 'anniversary' },
            ],
        },
        {
            level: 3,
            title: '經典模式通關',
            description: '以經典模式完成遊戲',
            conditions: [{ type: 'clear-mode', mode: 'classic' }],
        },
        {
            level: 4,
            title: '經典模式 + 全寶石通關',
            description: '以經典模式完成遊戲並收集全部混沌寶石',
            conditions: [
                { type: 'clear-mode', mode: 'classic' },
                { type: 'all-chaos-emeralds', mode: 'classic' },
            ],
        },
        {
            level: 5,
            title: '完成 Level 4，並以所有可選角色完成紀念模式 + 全寶石通關',
            description:
                '先完成 Level 4，再以所有可選角色通過紀念模式並收集全部混沌寶石',
            conditions: [
                { type: 'complete-previous-level', level: 4 },
                { type: 'all-characters-clear', mode: 'anniversary', includeAllEmeralds: true },
            ],
        },
    ],
};

export const sonic2Input: RawSonicGameInput = {
    id: 'sonic-the-hedgehog-2',
    slug: 'sonic-2',
    title: 'Sonic the Hedgehog 2',
    releaseYear: 1992,
    era: 'classic',
    recommendedVersion: 'sonic-origins',
    platforms: ['nintendo-switch', 'ps4', 'ps5', 'xbox-one', 'xbox-series', 'pc'],
    assets: {
        logo: { src: '/assets/sonic-2/logo.png', alt: 'Sonic the Hedgehog 2 logo' },
        heroImage: { src: '/assets/sonic-2/hero.png', alt: 'Sonic the Hedgehog 2 hero image' },
        screenshots: [],
    },
    levels: [
        {
            level: 1,
            title: '紀念模式通關',
            description: '以紀念模式完成遊戲',
            conditions: [{ type: 'clear-mode', mode: 'anniversary' }],
        },
        {
            level: 2,
            title: '紀念模式 + 全寶石通關',
            description: '以紀念模式完成遊戲並收集全部混沌寶石',
            conditions: [
                { type: 'clear-mode', mode: 'anniversary' },
                { type: 'all-chaos-emeralds', mode: 'anniversary' },
            ],
        },
        {
            level: 3,
            title: '經典模式通關',
            description: '以經典模式完成遊戲',
            conditions: [{ type: 'clear-mode', mode: 'classic' }],
        },
        {
            level: 4,
            title: '經典模式 + 全寶石通關',
            description: '以經典模式完成遊戲並收集全部混沌寶石',
            conditions: [
                { type: 'clear-mode', mode: 'classic' },
                { type: 'all-chaos-emeralds', mode: 'classic' },
            ],
        },
        {
            level: 5,
            title: '紀念模式全角色組合全寶石通關 + 經典模式全角色組合全寶石通關',
            description:
                '以紀念模式所有角色組合收集全部混沌寶石通關，以及以經典模式所有角色組合收集全部混沌寶石通關',
            conditions: [
                { type: 'all-character-combinations-clear', mode: 'anniversary', includeAllEmeralds: true },
                { type: 'all-character-combinations-clear', mode: 'classic', includeAllEmeralds: true },
            ],
        },
    ],
};
