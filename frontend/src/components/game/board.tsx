import { useEffect, useState } from "react";
import { Game } from "../../utils/types";
import Win from "./win";
import Lost from "./lost";
import {
  GAME_SYNC_TYPE_IN_FLY,
  GAME_SYNC_TYPE_START,
} from "../../utils/constant";

const Board: React.FC<{
  game: Game;
  syncGame: (game: Game, syncType: string, playerIndex: number) => void;
}> = ({ game, syncGame }) => {
  const [playerIndex, setPlayerIndex] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  function placeChip(board: HTMLDivElement) {
    const boardGrids = board.querySelectorAll(".chip.top");

    const lastNonPlayerDiv = Array.from(boardGrids).pop();
    if (lastNonPlayerDiv) {
      lastNonPlayerDiv.classList.remove("top");
      const pos = +(lastNonPlayerDiv.getAttribute("data-index") ?? 0);
      if (pos) {
        const turn = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(turn);

        const steps = game.steps ?? {};
        steps[pos] = currentPlayer;

        syncGame(
          {
            ...game,
            turn,
            steps,
            lastStep: { pos, player: currentPlayer },
          },
          GAME_SYNC_TYPE_IN_FLY,
          playerIndex
        );
      }
    }
  }

  useEffect(() => {
    if (game) {
      if (game.winner) {
        // There is already a winner, lock the game
        setCurrentPlayer(0);
      } else {
        if (game.turn) {
          setCurrentPlayer(game.turn);
        } else {
          setCurrentPlayer(1);
        }
      }

      setPlayerIndex(
        localStorage.getItem("userid") === game.player1_id ? 1 : 2
      );
    }
  }, [game]);

  function startNewGame() {
    syncGame(game, GAME_SYNC_TYPE_START, playerIndex);
  }

  return (
    <>
      {game.winner === playerIndex ? (
        <Win startNewGame={startNewGame} />
      ) : game.winner ? (
        <Lost startNewGame={startNewGame} />
      ) : null}

      <div>
        <span>Player Turn:</span>{" "}
        <span className="font-bold text-xl">
          {currentPlayer === 1 ? game.player1_name : game.player2_name}
        </span>
      </div>
      <div className="board grid grid-cols-7 mt-8 m-auto relative">
        {Array.from({ length: 7 }).map((_, col) => {
          return (
            <div
              key={col}
              className="boardCol grid grid-rows-7 relative"
              onClick={(e) => {
                e.preventDefault();
                if (playerIndex !== currentPlayer) {
                  return;
                }

                placeChip(e.currentTarget);
              }}
              onMouseEnter={(e) => {
                if (playerIndex !== currentPlayer) {
                  return;
                }
                const boardGrids =
                  e.currentTarget.querySelectorAll(".chip.top");

                const lastNonPlayerDiv = Array.from(boardGrids).pop();
                if (lastNonPlayerDiv) {
                  lastNonPlayerDiv.classList.add(`player${currentPlayer}`);
                }
              }}
              onMouseLeave={(e) => {
                if (playerIndex !== currentPlayer) {
                  return;
                }

                const boardGrids =
                  e.currentTarget.querySelectorAll(".chip.top");

                const lastNonPlayerDiv = Array.from(boardGrids).pop();
                if (lastNonPlayerDiv) {
                  lastNonPlayerDiv.classList.remove(`player${currentPlayer}`);
                }
              }}
            >
              <div className="boardGrid roof"></div>
              {Array.from({ length: 6 }).map((_, row) => {
                const index = row * 7 + col + 1;
                const playerClass =
                  game.steps?.[index] === 1
                    ? "player1"
                    : game.steps?.[index] === 2
                    ? "player2"
                    : "top";
                return (
                  <div className="boardGrid" key={row}>
                    <div
                      className={`chip ${playerClass} row${row + 1} `}
                      data-index={index}
                    ></div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Board;
