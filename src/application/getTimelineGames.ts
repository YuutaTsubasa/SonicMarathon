import type { SonicGame } from '../domain/sonicGame.ts';
import type { SonicGameRepository } from '../domain/sonicGameRepository.ts';

export type GetTimelineGames = () => readonly SonicGame[];

export const createGetTimelineGames = (
    repository: SonicGameRepository,
): GetTimelineGames => () => repository.getAll();
