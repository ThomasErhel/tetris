export type TetrominoShape = (string | null)[][];

export const tetrominos: Record<string, TetrominoShape> = {
  I: [
    [null, "cyan", null, null],
    [null, "cyan", null, null],
    [null, "cyan", null, null],
    [null, "cyan", null, null],
  ],
  O: [
    ["yellow", "yellow"],
    ["yellow", "yellow"],
  ],
  T: [
    [null, "purple", null],
    ["purple", "purple", "purple"],
    [null, null, null],
  ],
  S: [
    [null, "green", "green"],
    ["green", "green", null],
    [null, null, null],
  ],
  Z: [
    ["red", "red", null],
    [null, "red", "red"],
    [null, null, null],
  ],
  J: [
    [null, "blue", null],
    [null, "blue", null],
    ["blue", "blue", null],
  ],
  L: [
    [null, "orange", null],
    [null, "orange", null],
    [null, "orange", "orange"],
  ],
};

export const randomTetromino = () => {
  const tetrominoShapes = "IOJLSZT";
  const randomShape =
    tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)];
  return tetrominos[randomShape];
};
