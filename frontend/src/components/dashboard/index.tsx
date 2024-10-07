import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameService from "../../services/game.service";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useGame } from "../../context/game.context";
import { Game } from "../../utils/types";

const socket_url = import.meta.env.VITE_SERVER_URL;
const socket = io(socket_url);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const gameService = new GameService();
  const { setGame } = useGame();

  const [pendingGames, setPendingGames] = useState<Game[]>([]);

  const { data: games, refetch } = useSuspenseQuery({
    queryKey: ["games"],
    queryFn: () => gameService.listGames(),
  });

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/");
    } else {
      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.on("message_from_server", (message) => {
        console.log(message);
        queryClient.invalidateQueries({ queryKey: ["games"] });
      });

      return () => {
        socket.off("message_from_server");
        socket.off("connect");
      };
    }
  }, []);

  useEffect(() => {
    const pending = [];
    const userId = localStorage.getItem("userid");
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      if (game.player1_id === userId || game.player2_id === userId) {
        if (localStorage.getItem(game.gameId) !== "exit") {
          setGame(game);
          navigate("/game");
          break;
        }
      }

      if (!game.player1_id || !game.player2_id) {
        pending.push(game);
      }
    }

    setPendingGames(pending);
  }, [games, refetch]);

  async function createNewGame() {
    const userId = localStorage.getItem("userid");
    const username = localStorage.getItem("username");
    if (userId && username) {
      const game = await gameService.createGame(userId, username);
      if (game) {
        setGame(game);
        navigate("/game");
      } else {
        alert("Game creation failed.");
      }
    }
  }

  async function joinGame(gameId: string, playerIndex: number) {
    const userId = localStorage.getItem("userid");
    const username = localStorage.getItem("username");
    if (userId && username) {
      const game = await gameService.joinGame(
        gameId,
        userId,
        username,
        playerIndex
      );
      if (game) {
        localStorage.removeItem(game.gameId);
        setGame(game);
        navigate("/game");
      } else {
        alert("Join Game Failed");
      }
    }
  }

  return (
    <>
      <div className="dashboard">
        <div>
          <div className="mb-12">
            <h2 className="text-4xl mb-8">Create your own game:</h2>
            <div>
              <button
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  createNewGame();
                }}
              >
                Create Game
              </button>
            </div>
          </div>
        </div>
        {pendingGames.length > 0 && (
          <>
            <div className="text-4xl mb-8">Or join a game:</div>
            <div className="flex flex-wrap">
              {pendingGames.map((game) => {
                const player1 = game.player1_id ? (
                  game.player1_name
                ) : (
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.preventDefault();
                      joinGame(game.gameId, 1);
                    }}
                  >
                    Join
                  </button>
                );

                const player2 = game.player2_id ? (
                  game.player2_name
                ) : (
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.preventDefault();
                      joinGame(game.gameId, 2);
                    }}
                  >
                    Join
                  </button>
                );

                return (
                  <div
                    key={game.gameId}
                    className="gameCard mr-8 mb-8 font-bold"
                  >
                    <div className="mb-4">
                      <span className="pr-4">Player 1: </span>
                      <span className="cardPlayer">{player1}</span>
                    </div>
                    <div>
                      <span className="pr-4">Player 2: </span>
                      <span className="cardPlayer">{player2}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
