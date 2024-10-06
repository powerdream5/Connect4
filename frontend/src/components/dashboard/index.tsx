import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameService from "../../services/game.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGame } from "../../context/game.context";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const gameService = new GameService();
  const { setGame } = useGame();

  const { data: games } = useSuspenseQuery({
    queryKey: ["cards"],
    queryFn: () => gameService.listGames(),
  });

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      if (game.player1_id === userId || game.player2_id === userId) {
        setGame(game);
        navigate("/game");
        break;
      }
    }
  }, [games]);

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

  async function joinGame(gameId: string) {
    const userId = localStorage.getItem("userid");
    const username = localStorage.getItem("username");
    if (userId && username) {
      const game = await gameService.joinGame(gameId, userId, username);
      if (game) {
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
        {games.length > 0 && (
          <>
            <div className="text-4xl mb-8">Or join a game:</div>
            <div className="flex flex-wrap">
              {games.map((game) => {
                return (
                  <div
                    key={game.gameId}
                    className="gameCard text-center mr-8 mb-8"
                  >
                    <div>Player 1</div>
                    <div className="font-bold mb-4">{game.player1_name}</div>
                    <div>
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.preventDefault();
                          joinGame(game.gameId);
                        }}
                      >
                        Join
                      </button>
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
