<script lang="ts">
    import type { GetTimelineGames } from '../../application/getTimelineGames.ts';
    import Timeline from '../components/Timeline.svelte';

    let { getTimelineGames }: { getTimelineGames: GetTimelineGames } = $props();
    const games = getTimelineGames();
</script>

<svelte:head>
    <title>Sonic Marathon</title>
    <meta
        name="description"
        content="Explore Sonic the Hedgehog games across a single chronological marathon timeline."
    />
</svelte:head>

<main class="home-page">
    <header class="hero">
        <p class="hero__eyebrow">RUN THROUGH HISTORY</p>
        <h1>Sonic Marathon</h1>
        <p class="hero__copy">A chronological run through Sonic's mainline adventures.</p>
    </header>

    <Timeline {games} />
</main>

<style>
    :global(html) {
        background: #0756c9;
    }

    :global(body) {
        margin: 0;
        min-width: 20rem;
        background:
            radial-gradient(circle at 12% 12%, rgb(255 255 255 / 16%), transparent 22rem),
            linear-gradient(145deg, #0756c9, #0a8ee8);
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
    }

    .home-page {
        min-height: 100vh;
        overflow: hidden;
    }

    .hero {
        max-width: 72rem;
        margin: 0 auto;
        padding: 4rem 2rem 1rem;
    }

    .hero__eyebrow {
        margin: 0 0 0.5rem;
        color: #f4c430;
        font-size: 0.85rem;
        font-weight: 900;
        letter-spacing: 0.24em;
    }

    h1 {
        margin: 0;
        font-size: clamp(3rem, 8vw, 6rem);
        line-height: 0.9;
        text-transform: uppercase;
        text-shadow: 0.2rem 0.25rem 0 #123477;
    }

    .hero__copy {
        max-width: 34rem;
        margin: 1rem 0 0;
        font-size: 1.05rem;
        line-height: 1.55;
    }
</style>
