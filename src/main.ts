import { mount } from 'svelte';

import HomePage from './ui/routes/HomePage.svelte';
import { getTimelineGames } from './ui/createTimelinePage.ts';

const target = document.getElementById('app');
if (target === null) {
    throw new Error('Missing #app mount target.');
}

mount(HomePage, {
    target,
    props: { getTimelineGames },
});
