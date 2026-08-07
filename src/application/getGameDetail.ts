import type { GameSlug } from '../domain/sonicGame.ts';
import type { FindGameResult, SonicGameRepository } from '../domain/sonicGameRepository.ts';

export type GetGameDetail = (slug: GameSlug) => FindGameResult;

export const createGetGameDetail = (
    repository: SonicGameRepository,
): GetGameDetail => slug => repository.findBySlug(slug);
