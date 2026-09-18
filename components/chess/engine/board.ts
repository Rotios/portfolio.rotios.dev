import type {
  Board,
  Color,
  File,
  Piece,
  PieceType,
  Rank,
  Square,
} from "./types";

export const FILES: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS: Rank[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const ALL_SQUARES: Square[] = FILES.flatMap((file) =>
  RANKS.map((rank) => `${file}${rank}` as Square),
);

export function opposite(color: Color): Color {
  return color === "white" ? "black" : "white";
}

export function squareToCoords(square: Square): [file: number, rank: number] {
  const file = square[0] as File;
  const rank = square[1] as Rank;

  return [FILES.indexOf(file), RANKS.indexOf(rank)];
}

export function coordsToSquare(
  fileIdx: number,
  rankIdx: number,
): Square | null {
  if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) {
    return null;
  }

  return `${FILES[fileIdx]}${RANKS[rankIdx]}` as Square;
}

export function createEmptyBoard(): Board {
  const board = {} as Board;

  for (const square of ALL_SQUARES) {
    board[square] = null;
  }

  return board;
}

export function createInitialBoard(): Board {
  const board = createEmptyBoard();
  const backRank: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  FILES.forEach((file, i) => {
    board[`${file}1` as Square] = { type: backRank[i], color: "white" };
    board[`${file}2` as Square] = { type: "pawn", color: "white" };
    board[`${file}7` as Square] = { type: "pawn", color: "black" };
    board[`${file}8` as Square] = { type: backRank[i], color: "black" };
  });

  return board;
}

export function cloneBoard(board: Board): Board {
  return { ...board };
}

export function findKing(board: Board, color: Color): Square | null {
  for (const square of ALL_SQUARES) {
    const piece = board[square];

    if (piece && piece.type === "king" && piece.color === color) {
      return square;
    }
  }

  return null;
}

export function pieceAt(board: Board, square: Square): Piece | null {
  return board[square];
}
