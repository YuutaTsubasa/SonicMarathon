<script lang="ts">
    import type { SonicGame } from '../../domain/sonicGame.ts';

    let { games }: { games: readonly SonicGame[] } = $props();
</script>

<section class="timeline" aria-label="Sonic game timeline" data-testid="timeline">
    <ol class="timeline__track">
        {#each games as game (game.id)}
            <li class="timeline__item">
                <button class="timeline-node" type="button" aria-label={`View ${game.title}`}>
                    <span class="timeline-node__year">{game.releaseYear}</span>
                    <span class="timeline-node__marker" aria-hidden="true"></span>
                    <span class="timeline-node__artwork">
                        <img src={game.assets.logo.src} alt={game.assets.logo.alt} />
                    </span>
                    <span class="timeline-node__title">{game.title}</span>
                </button>
            </li>
        {/each}
    </ol>
</section>

<style>
    .timeline {
        --timeline-padding-block-start: 2rem;
        --timeline-padding-inline: 1.5rem;
        --timeline-padding-block-end: 3rem;
        --timeline-node-width: 17rem;
        --timeline-line-offset: 3.6rem;
        --timeline-line-thickness: 0.3rem;
        --timeline-node-artwork-row-height: 8rem;
        --timeline-node-gap: 0.65rem;
        --timeline-focus-width: 0.2rem;
        --timeline-focus-offset: 0.4rem;
        --timeline-focus-radius: 0.5rem;
        --timeline-year-font-size: 1.15rem;
        --timeline-year-font-weight: 800;
        --timeline-year-letter-spacing: 0.08em;
        --timeline-marker-size: 1.35rem;
        --timeline-marker-border-width: 0.3rem;
        --timeline-marker-ring-width: 0.2rem;
        --timeline-artwork-width: 13rem;
        --timeline-artwork-height: 8rem;
        --timeline-artwork-padding: 0.8rem;
        --timeline-artwork-radius: 1.2rem;
        --timeline-artwork-opacity: 92%;
        --timeline-artwork-shadow-y: 0.75rem;
        --timeline-artwork-shadow-blur: 2rem;
        --timeline-artwork-shadow-opacity: 20%;
        --timeline-title-max-width: 14rem;
        --timeline-title-font-weight: 700;
        --timeline-brand-gold: var(--color-sonic-gold, #f4c430);
        --timeline-brand-blue: #1467d8;
        --timeline-surface: var(--color-surface-on-blue, #fff);

        overflow-x: auto;
        padding:
            var(--timeline-padding-block-start)
            var(--timeline-padding-inline)
            var(--timeline-padding-block-end);
        scrollbar-gutter: stable;
    }

    .timeline__track {
        display: flex;
        align-items: stretch;
        width: max-content;
        min-width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .timeline__item {
        position: relative;
        flex: 0 0 var(--timeline-node-width);
    }

    .timeline__item::after {
        content: '';
        position: absolute;
        top: var(--timeline-line-offset);
        left: 50%;
        width: 100%;
        height: var(--timeline-line-thickness);
        background: var(--timeline-brand-gold);
        transform: translateX(50%);
        z-index: 0;
    }

    .timeline__item:last-child::after {
        display: none;
    }

    .timeline-node {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-rows: auto auto var(--timeline-node-artwork-row-height) auto;
        justify-items: center;
        gap: var(--timeline-node-gap);
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
    }

    .timeline-node:focus-visible {
        outline: var(--timeline-focus-width) solid currentColor;
        outline-offset: var(--timeline-focus-offset);
        border-radius: var(--timeline-focus-radius);
    }

    .timeline-node__year {
        font-size: var(--timeline-year-font-size);
        font-weight: var(--timeline-year-font-weight);
        letter-spacing: var(--timeline-year-letter-spacing);
    }

    .timeline-node__marker {
        width: var(--timeline-marker-size);
        aspect-ratio: 1;
        border: var(--timeline-marker-border-width) solid var(--timeline-surface);
        border-radius: 50%;
        background: var(--timeline-brand-blue);
        box-shadow: 0 0 0 var(--timeline-marker-ring-width) var(--timeline-brand-gold);
    }

    .timeline-node__artwork {
        display: grid;
        place-items: center;
        width: var(--timeline-artwork-width);
        height: var(--timeline-artwork-height);
        padding: var(--timeline-artwork-padding);
        border-radius: var(--timeline-artwork-radius);
        background: rgb(255 255 255 / var(--timeline-artwork-opacity));
        box-shadow:
            0
            var(--timeline-artwork-shadow-y)
            var(--timeline-artwork-shadow-blur)
            rgb(0 0 0 / var(--timeline-artwork-shadow-opacity));
    }

    .timeline-node__artwork img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .timeline-node__title {
        max-width: var(--timeline-title-max-width);
        font-weight: var(--timeline-title-font-weight);
        text-align: center;
    }
</style>
