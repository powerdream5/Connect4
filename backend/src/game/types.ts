export interface Game {
  gameId: string;
  player1_id: string;
  player1_name: string;
  player1_ready: boolean;
  player2_id?: string;
  player2_name?: string;
  player2_ready?: boolean;
  status: string;
  player1_wins?: number;
  player2_wins?: number;
  player_turn?: number;
  lastStep?: { pos: number; player: number };
  posStat?: Record<number, Record<string, number>>;
}
