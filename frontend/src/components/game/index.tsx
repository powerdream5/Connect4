import io from "socket.io-client";
import { useEffect } from "react";
import { useGame } from "../../context/game.context";
import { useNavigate } from "react-router-dom";
import Board from "./board";
import Score from "./score";
import { Game as GameT } from "../../utils/types";
import GameService from "../../services/game.service";

const socket_url = import.meta.env.VITE_SERVER_URL;
const socket = io(socket_url);

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { game, setGame } = useGame();
  const gameService = new GameService();

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

        setGame(game);
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

  async function exitGame() {
    const userId = localStorage.getItem("userid");
    if (game && userId) {
      if (await gameService.exitGame(game?.gameId, userId)) {
        localStorage.setItem(game.gameId, "exit");

        setGame(null as unknown as GameT);
      }
    }
  }

  return (
    <>
      <div className="gameRoom flex">
        <div className="gameScore text-center mr-8 relative">
          {game && <Score game={game} exitGame={exitGame} />}
        </div>
        <div className="gameBoard shrink w-full relative">
          {game && (
            <Board game={game} syncGame={syncGame} exitGame={exitGame}></Board>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
