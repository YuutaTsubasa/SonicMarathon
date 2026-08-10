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
    :global(:root) {
        --color-sonic-blue: #0756c9;
        --color-sonic-sky: #0a8ee8;
        --color-sonic-gold: #f4c430;
        --color-sonic-navy: #123477;
        --color-surface-on-blue: #fff;
        --page-min-width: 20rem;
        --page-highlight-position: 12%;
        --page-highlight-size: 22rem;
        --page-highlight-opacity: 16%;
        --page-gradient-angle: 145deg;
        --hero-max-width: 72rem;
        --hero-padding-block-start: 4rem;
        --hero-padding-inline: 2rem;
        --hero-padding-block-end: 1rem;
        --eyebrow-margin-bottom: 0.5rem;
        --eyebrow-font-size: 0.85rem;
        --eyebrow-font-weight: 900;
        --eyebrow-letter-spacing: 0.24em;
        --title-font-size-min: 3rem;
        --title-font-size-fluid: 8vw;
        --title-font-size-max: 6rem;
        --title-line-height: 0.9;
        --title-shadow-x: 0.2rem;
        --title-shadow-y: 0.25rem;
        --body-copy-max-width: 34rem;
        --body-copy-margin-top: 1rem;
        --body-copy-font-size: 1.05rem;
        --body-copy-line-height: 1.55;
    }

    :global(html) {
        background: var(--color-sonic-blue);
    }

    :global(body) {
        margin: 0;
        min-width: var(--page-min-width);
        background:
            radial-gradient(
                circle at var(--page-highlight-position) var(--page-highlight-position),
                rgb(255 255 255 / var(--page-highlight-opacity)),
                transparent var(--page-highlight-size)
            ),
            linear-gradient(
                var(--page-gradient-angle),
                var(--color-sonic-blue),
                var(--color-sonic-sky)
            );
        color: var(--color-surface-on-blue);
        font-family: Arial, Helvetica, sans-serif;
    }

    .home-page {
        min-height: 100vh;
        overflow: hidden;
    }

    .hero {
        max-width: var(--hero-max-width);
        margin: 0 auto;
        padding:
            var(--hero-padding-block-start)
            var(--hero-padding-inline)
            var(--hero-padding-block-end);
    }

    .hero__eyebrow {
        margin: 0 0 var(--eyebrow-margin-bottom);
        color: var(--color-sonic-gold);
        font-size: var(--eyebrow-font-size);
        font-weight: var(--eyebrow-font-weight);
        letter-spacing: var(--eyebrow-letter-spacing);
    }

    h1 {
        margin: 0;
        font-size: clamp(
            var(--title-font-size-min),
            var(--title-font-size-fluid),
            var(--title-font-size-max)
        );
        line-height: var(--title-line-height);
        text-transform: uppercase;
        text-shadow:
            var(--title-shadow-x)
            var(--title-shadow-y)
            0
            var(--color-sonic-navy);
    }

    .hero__copy {
        max-width: var(--body-copy-max-width);
        margin: var(--body-copy-margin-top) 0 0;
        font-size: var(--body-copy-font-size);
        line-height: var(--body-copy-line-height);
    }
</style>
