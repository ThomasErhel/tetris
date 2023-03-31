import React, { useState } from "react";
import "./App.css";
import Board from "./components/Board";
import BoardContext from "./context/BoardContext";

const linePoints = [0, 40, 100, 300, 1200];
const level = 0;
const gameOver = false;

function App() {
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const resetGame = () => {
    setGameStarted(false);
  };

  const onScoreUpdate = (linesCleared: number) => {
    setScore((prevScore) => prevScore + linePoints[linesCleared] * (level + 1));
  };

  return (
    <div className="App">
      <h1>Tetris</h1>
      <BoardContext.Provider
        value={{
          gameOver,
          score,
          onScoreUpdate: onScoreUpdate,
        }}
      >
        <Board
          onGameOver={resetGame}
          gameStarted={gameStarted}
          onScoreUpdate={onScoreUpdate}
        />
      </BoardContext.Provider>

      <div>
        <h2>Score: {score}</h2>
        {!gameStarted ? (
          <button onClick={() => setGameStarted(true)}>Start Game</button>
        ) : (
          <button onClick={resetGame}>Reset Game</button>
        )}
      </div>
    </div>
  );
}

export default App;
