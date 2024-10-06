import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaughBeam } from "@fortawesome/free-solid-svg-icons";

const Win: React.FC<{ startNewGame: () => void }> = ({ startNewGame }) => {
  return (
    <div className="text-center text-green-500 absolute bg-white left-0 right-0 z-50">
      <div className="text-3xl">
        <div className="mb-8">
          <FontAwesomeIcon icon={faFaceLaughBeam} size="2xl" />
          <span className="pl-4 font-bold text-4xl">You win !</span>
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
            <button className="btn-plain">Exit</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Win;
