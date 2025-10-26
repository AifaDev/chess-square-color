// Chess utility functions

export const FILES = "abcdefgh";
export const RANKS = "12345678";

export const getRandomSquare = (): string => {
  return (
    FILES[Math.floor(Math.random() * 8)] + RANKS[Math.floor(Math.random() * 8)]
  );
};

export const isSquareBlack = (square: string): "black" | "white" => {
  const fileIdx = FILES.indexOf(square[0]);
  const rankIdx = RANKS.indexOf(square[1]);
  return fileIdx % 2 === rankIdx % 2 ? "black" : "white";
};

export const getSquareFromCoordinates = (row: number, col: number): string => {
  // row 0 = rank 8, row 7 = rank 1
  // col 0 = file a, col 7 = file h
  const file = FILES[col];
  const rank = RANKS[7 - row];
  return `${file}${rank}`;
};

export const getCoordinatesFromSquare = (
  square: string
): { row: number; col: number } => {
  const file = square[0];
  const rank = square[1];
  const col = FILES.indexOf(file);
  const row = 7 - RANKS.indexOf(rank);
  return { row, col };
};

// Knight move offsets (L-shaped moves)
const KNIGHT_MOVES = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

// Get all valid knight moves from a square
export const getKnightMoves = (square: string): string[] => {
  const { row, col } = getCoordinatesFromSquare(square);
  const validMoves: string[] = [];

  for (const [rowOffset, colOffset] of KNIGHT_MOVES) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;

    // Check if the move is within board bounds
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      validMoves.push(getSquareFromCoordinates(newRow, newCol));
    }
  }

  return validMoves;
};

// Get a random square but with some constraints for better knight questions
export const getRandomKnightSquare = (): string => {
  // Avoid edge squares for more interesting knight patterns
  // But include them sometimes (30% chance)
  if (Math.random() < 0.7) {
    const file = FILES[1 + Math.floor(Math.random() * 6)]; // b-g
    const rank = RANKS[1 + Math.floor(Math.random() * 6)]; // 2-7
    return file + rank;
  }
  return getRandomSquare();
};

// Piece starting positions
const PIECE_STARTING_POSITIONS: Record<string, string[]> = {
  whiteKing: ["e1"],
  whiteQueen: ["d1"],
  whiteRook: ["a1", "h1"],
  whiteBishop: ["c1", "f1"],
  whiteKnight: ["b1", "g1"],
  whitePawn: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  blackKing: ["e8"],
  blackQueen: ["d8"],
  blackRook: ["a8", "h8"],
  blackBishop: ["c8", "f8"],
  blackKnight: ["b8", "g8"],
  blackPawn: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
};

export interface PieceStartingPosition {
  pieceName: string; // e.g., "white queenside bishop" or "black kingside knight"
  square: string;
  color: "white" | "black";
  pieceType: string; // e.g., "bishop", "knight"
}

// Get a random piece starting position
export const getRandomPieceStartingPosition = (): PieceStartingPosition => {
  const colors = ["white", "black"] as const;
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Pieces that have queenside/kingside variations
  const pieceTypes = ["Rook", "Bishop", "Knight"];
  const pieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];

  const key = `${color}${pieceType}`;
  const positions = PIECE_STARTING_POSITIONS[key];

  // For pieces with two positions, randomly pick queenside or kingside
  const side = Math.random() > 0.5 ? "kingside" : "queenside";
  const square = side === "kingside" ? positions[1] : positions[0];

  return {
    pieceName: `${color} ${side} ${pieceType.toLowerCase()}`,
    square,
    color,
    pieceType: pieceType.toLowerCase(),
  };
};
