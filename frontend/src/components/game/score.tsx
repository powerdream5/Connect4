import { Game } from "../../utils/types";

const Score: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <>
      <div>
        <span className="player1"></span>
      </div>
      <div className="text-lg font-bold mb-8">{game?.player1_name}</div>
      <div className="text-4xl font-bold mb-4">{game?.player1_wins ?? 0}</div>
      <div className="text-2xl mb-4">VS</div>
      <div className="text-4xl font-bold mb-8">{game?.player2_wins ?? 0}</div>
      {game?.player2_id && (
        <>
          <div>
            <span className="player2"></span>
          </div>
          <div className="text-lg font-bold mb-8">{game?.player2_name}</div>
        </>
      )}
      {!game?.player2_id && (
        <>
          <div className="text-lg font-bold text-slate-400">
            <div className="mb-2">Player 2 Pending</div>
            <div className="loader"></div>
          </div>
        </>
      )}
    </>
  );
};

export default Score;
