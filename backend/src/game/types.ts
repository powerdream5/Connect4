export interface Game {
    gameId: string;
    player1_id: string;
    player1_name: string;
    player2_id?: string;
    player2_name?: string;
    status: string;
}