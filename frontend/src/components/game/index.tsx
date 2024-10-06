import io from "socket.io-client";
import { useEffect } from "react";
import { useGame } from "../../context/game.context";
import { useNavigate } from "react-router-dom";
import Board from "./board";
import Score from "./score";
import { Game as GameT } from "../../utils/types";
import {
  GAME_SYNC_TYPE_START,
  GAME_SYNC_TYPE_IN_FLY,
  GAME_SYNC_TYPE_JOIN,
} from "../../utils/constant";

const socket = io("http://localhost:3000");

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { game, setGame } = useGame();

  useEffect(() => {
    if (!game) {
      navigate("/");
    } else {
      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.on("message_from_room", (message) => {
        const { syncType, game, playerIndex } = JSON.parse(message) as {
          syncType: string;
          game: GameT;
          playerIndex: number;
        };

        console.log(syncType, game, playerIndex);

        if (
          syncType === GAME_SYNC_TYPE_IN_FLY ||
          syncType === GAME_SYNC_TYPE_JOIN
        ) {
          setGame(game);
        } else if (syncType === GAME_SYNC_TYPE_START) {
          const pidx =
            game.player1_id === localStorage.getItem("userid") ? 1 : 2;
          if (pidx === playerIndex) {
            setGame(game);
          }
        }
      });

      socket.emit("join_room", game.gameId);

      return () => {
        socket.off("message_from_room");
        socket.off("connect");
      };
    }
  }, [game]);

  function syncGame(game: GameT, syncType: string, playerIndex: number) {
    socket.emit("message_to_room", {
      room: game.gameId,
      syncType,
      playerIndex,
      game: JSON.stringify(game),
    });
  }

  return (
    <>
      <div className="gameRoom flex">
        <div className="gameScore text-center mr-8">
          {game && <Score game={game} />}
        </div>
        <div className="gameBoard shrink w-full relative">
          {game && <Board game={game} syncGame={syncGame}></Board>}
        </div>
      </div>
    </>
  );
};

export default Game;
