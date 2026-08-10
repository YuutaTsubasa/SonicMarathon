import { createGetTimelineGames } from '../application/getTimelineGames.ts';
import { staticSonicGameRepository } from '../infrastructure/staticSonicGameRepository.ts';

export const getTimelineGames = createGetTimelineGames(staticSonicGameRepository);
