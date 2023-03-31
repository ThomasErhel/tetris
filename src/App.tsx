import { useState } from "react";
import "./App.css";
import Board from "./components/Board";

const linePoints = [0, 40, 100, 300, 1200];
const level = 0;

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
      <Board
        onGameOver={resetGame}
        gameStarted={gameStarted}
        onScoreUpdate={onScoreUpdate}
      />
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
