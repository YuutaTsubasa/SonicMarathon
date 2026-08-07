import type { GameId, GameSlug, SonicGame } from './sonicGame.ts';

export type FindGameResult =
    | Readonly<{
          type: 'found';
          game: SonicGame;
      }>
    | Readonly<{
          type: 'not-found';
      }>;

export type SonicGameRepository = Readonly<{
    getAll: () => readonly SonicGame[];
    findById: (id: GameId) => FindGameResult;
    findBySlug: (slug: GameSlug) => FindGameResult;
}>;
