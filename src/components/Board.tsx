import React, { useCallback, useEffect, useRef, useState } from "react";
import { TetrominoShape, randomTetromino } from "./Tetromino";
import Block from "./Block";

type BoardGrid = (string | null)[][];

const createEmptyBoard = (): BoardGrid => {
  return new Array(20).fill(null).map(() => new Array(10).fill(null));
};

interface Position {
  x: number;
  y: number;
}

interface BoardProps {
  onScoreUpdate: (linesCleared: number) => void;
  onGameOver: () => void;
  gameStarted: boolean;
}

const initialPosition: Position = { x: 4, y: 0 };

interface BoardProps {
  onScoreUpdate: (linesCleared: number) => void;
  onGameOver: () => void;
  gameStarted: boolean;
}

const Board: React.FC<BoardProps> = ({
  onScoreUpdate,
  onGameOver,
  gameStarted,
}) => {
  const [board, setBoard] = useState<BoardGrid>(createEmptyBoard);
  const [tetromino, setTetromino] = useState<TetrominoShape>(randomTetromino());
  const [position, setPosition] = useState<Position>(initialPosition);
  const clearFullRowsRef = useRef<(board: BoardGrid) => BoardGrid>();
  const spawnTetromino = useCallback(() => {
    const newTetromino = randomTetromino();
    const startPosition: Position = {
      x: Math.floor(board[0].length / 2) - 1,
      y: 0,
    };

    if (collision(board, newTetromino, startPosition)) {
      onGameOver();
    } else {
      setTetromino(newTetromino);
      setPosition(startPosition);
    }
  }, [board, onGameOver]);

  useEffect(() => {
    clearFullRowsRef.current = (board: BoardGrid): BoardGrid => {
      const clearedBoard = board.filter(
        (row) => !row.every((cell) => cell !== null)
      );
      const linesCleared = board.length - clearedBoard.length;
      if (linesCleared > 0) {
        onScoreUpdate(linesCleared);
      }
      const emptyRows = new Array(linesCleared)
        .fill(null)
        .map(() => new Array(10).fill(null));
      return [...emptyRows, ...clearedBoard];
    };
  }, [onScoreUpdate]);

  const mergeTetromino = (
    board: BoardGrid,
    tetromino: TetrominoShape,
    position: Position
  ): BoardGrid => {
    const mergedBoard = board.map((row, y) => {
      return row.map((cell, x) => {
        if (
          tetromino[y - position.y] &&
          tetromino[y - position.y][x - position.x]
        ) {
          return tetromino[y - position.y][x - position.x];
        }
        return cell;
      });
    });

    return mergedBoard;
  };

  const move = useCallback(
    (dir: number) => {
      if (!collision(board, tetromino, position, dir)) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x + dir,
        }));
      }
    },
    [board, tetromino, position]
  );

  const rotate = useCallback(() => {
    const rotatedTetromino = tetromino[0]
      .map((_, index) => tetromino.map((row) => row[index]))
      .reverse();

    if (!collision(board, rotatedTetromino, position)) {
      setTetromino(rotatedTetromino);
    }
  }, [board, tetromino, position]);

  const moveDown = useCallback(() => {
    if (!collision(board, tetromino, position, 0, 1)) {
      setPosition((prevPosition) => ({
        ...prevPosition,
        y: prevPosition.y + 1,
      }));
    } else {
      const updatedBoard = mergeTetromino(board, tetromino, position);
      const clearedBoard = clearFullRowsRef.current!(updatedBoard);
      setBoard(clearedBoard);
      spawnTetromino();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, tetromino, position]);

  const collision = (
    board: BoardGrid,
    tetromino: TetrominoShape,
    position: Position,
    xMove: number = 0,
    yMove: number = 0
  ): boolean => {
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (
          tetromino[y][x] &&
          (board[y + position.y + yMove] &&
            board[y + position.y + yMove][x + position.x + xMove]) !== null
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (event.key) {
        case "ArrowLeft":
          move(-1);
          break;
        case "ArrowRight":
          move(1);
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotate();
          break;
      }
    },
    [move, moveDown, rotate, gameStarted]
  );

  useEffect(() => {
    if (!gameStarted) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      moveDown();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [onGameOver, moveDown, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      setBoard(createEmptyBoard());
      setPosition(initialPosition);
      setTetromino(randomTetromino());
    }
  }, [gameStarted]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(20, calc(25vw / 10))`,
        gridTemplateColumns: `repeat(10, 1fr)`,
        width: "25vw",
        height: "50vw",
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          const block =
            cell ||
            (tetromino[rowIndex - position.y]?.[cellIndex - position.x] ??
              null);
          return (
            <Block key={`${rowIndex}-${cellIndex}`} color={block || "white"} />
          );
        })
      )}
    </div>
  );
};

export default Board;
