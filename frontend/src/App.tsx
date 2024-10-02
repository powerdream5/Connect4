import './App.css'
import { useState } from 'react';
import Username from './components/username';
import Game from './components/game';
import GameSerice from './services/game.service';
import { Game as GameT } from './utils/types';

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const [game, setGame] = useState<GameT>({gameId: '', player1_id: '', player1_name: ''});

  async function createNewGame() {
    const userId = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    if(userId && username) {
      const gameService = new GameSerice();
      const game = await gameService.createGame(userId, username);
      if(game) {
        setGame(game);
      }
      else {
        alert("Game creation failed.");
      }
    }
  }

  return (
    <>
      {
        (username === '') ? (
          <Username setUsername={setUsername}></Username>
        ) : (
          <>
            <div className="text-4xl mb-8">Hi {username}</div>
            {
              game.gameId ? (
                <Game game={game}></Game>
              ) : (
                <div>
                  <button className='btn' onClick={(e) => {
                    e.preventDefault();

                    createNewGame();
                  }}>Create New Game</button>
                </div>
              )
            }
          </>
        )
      }
    </>
  )
}

export default App