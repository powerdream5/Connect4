import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Game as GameT } from '../../utils/types';

const socket = io('http://localhost:3000');

const Game:React.FC<{game: GameT}> = ({ game }) => {
    const [steps, setSteps] = useState<Record<number, number>>({})
    const [currentPlayer, setCurrentPlayer] = useState(1)

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('message_from_room', (message) => {
            const obj = JSON.parse(message);
            setSteps(obj.steps);

            console.log(obj.winner);
        });

        socket.emit('join_room', 'joyous');

        return () => {
            socket.off('message');
            socket.off('connect');
        };
    }, []);

    function handGameGridClick (index: number) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

        const newSteps = {...steps, [index]: currentPlayer};

        setSteps(newSteps);

        socket.emit('message_to_room', {
            room: 'joyous',
            message: JSON.stringify(newSteps),
        });
    }

    return (
        <>
            <div>
              <div className='grid grid-cols-7 game-board' style={{width: "490px"}}>
                    {
                        Array.from({ length: 42 }).map((_, index) => {
                            return (
                                <div key={index}>
                                    <button 
                                        className={`player${steps[index+1]}` ?? ''} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handGameGridClick(index+1);
                                        }}
                                    >&nbsp;</button>
                                </div>
                            );
                        })
                    }
              </div>
              <div>
                <div>
                  <div><span className='player1'></span> Player 1: </div>
                  <div><span className='player2'></span> Player 2: </div>
                </div>
              </div>
            </div>
        </>
    );
}

export default Game;