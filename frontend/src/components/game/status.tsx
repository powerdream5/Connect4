import { Game } from "../../utils/types";

const Status: React.FC<{ game: Game; currentPlayer: number }> = ({
  game,
  currentPlayer,
}) => {
  if (game.player1_ready && game.player2_ready) {
    return (
      <>
        <span className="pr-4">Player Turn:</span>
        <span className="font-bold text-xl">
          {currentPlayer === 1 ? game.player1_name : game.player2_name}
        </span>
      </>
    );
  }

  if (game.player1_ready) {
    return (
      <>
        <span className="font-bold">
          Game is pending by {game.player2_name ?? "Player 2"}
        </span>
      </>
    );
  }

  if (game.player2_ready) {
    return (
      <>
        <span className="font-bold">
          Game is pending by {game.player1_name ?? "Player 1"}
        </span>
      </>
    );
  }
};

export default Status;
