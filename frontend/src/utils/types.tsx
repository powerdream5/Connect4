export type Game = {
  gameId: string;
  player1_id: string;
  player1_name: string;
  player1_wins: number;
  player1_ready: boolean;
  player2_id?: string;
  player2_name?: string;
  player2_ready: boolean;
  player2_wins: number;
  winner?: number;
  turn?: number;
  steps: Record<number, number>;
  lastStep: Record<string, number>;
};
