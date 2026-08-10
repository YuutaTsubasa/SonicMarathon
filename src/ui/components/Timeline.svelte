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
        overflow-x: auto;
        padding: 2rem 1.5rem 3rem;
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
        flex: 0 0 17rem;
    }

    .timeline__item::after {
        content: '';
        position: absolute;
        top: 3.6rem;
        left: 50%;
        width: 100%;
        height: 0.3rem;
        background: #f4c430;
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
        grid-template-rows: auto auto 8rem auto;
        justify-items: center;
        gap: 0.65rem;
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
    }

    .timeline-node:focus-visible {
        outline: 0.2rem solid currentColor;
        outline-offset: 0.4rem;
        border-radius: 0.5rem;
    }

    .timeline-node__year {
        font-size: 1.15rem;
        font-weight: 800;
        letter-spacing: 0.08em;
    }

    .timeline-node__marker {
        width: 1.35rem;
        aspect-ratio: 1;
        border: 0.3rem solid #fff;
        border-radius: 50%;
        background: #1467d8;
        box-shadow: 0 0 0 0.2rem #f4c430;
    }

    .timeline-node__artwork {
        display: grid;
        place-items: center;
        width: 13rem;
        height: 8rem;
        padding: 0.8rem;
        border-radius: 1.2rem;
        background: rgb(255 255 255 / 92%);
        box-shadow: 0 0.75rem 2rem rgb(0 0 0 / 20%);
    }

    .timeline-node__artwork img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .timeline-node__title {
        max-width: 14rem;
        font-weight: 700;
        text-align: center;
    }
</style>
