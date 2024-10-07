import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";

const Lost: React.FC<{ startNewGame: () => void; exitGame: () => void }> = ({
  startNewGame,
  exitGame,
}) => {
  return (
    <div className="text-center text-slate-500 absolute bg-white bg-opacity-70 pb-8 left-0 right-0 z-50">
      <div className="text-3xl">
        <div className="mb-4">
          <FontAwesomeIcon icon={faHeartCrack} size="2xl" />
          <span className="pl-4 font-bold text-4xl">You lost !</span>
        </div>
        <div className="text-xl">
          <span className="pr-8">
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                startNewGame();
              }}
            >
              Play Again
            </button>
          </span>
          <span>
            <button
              className="btn-plain"
              onClick={(e) => {
                e.preventDefault();
                exitGame();
              }}
            >
              Exit
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Lost;
