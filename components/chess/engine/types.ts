export type Color = "white" | "black";

export type PieceType =
  "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export interface Piece {
  type: PieceType;
  color: Color;
}

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
/** Algebraic square, e.g. "e4". */
export type Square = `${File}${Rank}`;

/** All 64 squares present; value is null when the square is empty. */
export type Board = Record<Square, Piece | null>;

export interface Move {
  from: Square;
  to: Square;
  /** Required only when the move is a pawn promotion. */
  promotion?: PieceType;
}

export type GameStatus =
  "active" | "check" | "checkmate" | "stalemate" | "draw";

export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

export interface GameState {
  board: Board;
  turn: Color;
  status: GameStatus;
  castlingRights: CastlingRights;
  /** Square a pawn can be captured on via en passant this move, or null. */
  enPassantTarget: Square | null;
  /** Half-moves since the last capture or pawn move (for the 50-move rule). */
  halfmoveClock: number;
  fullmoveNumber: number;
  moveHistory: Move[];
}
