import type { Board, CastlingRights, GameState, Piece, Square } from "../types";

import { createEmptyBoard } from "../board";

export function buildState(
  pieces: Partial<Record<Square, Piece>>,
  overrides: Partial<GameState> = {},
): GameState {
  const board: Board = createEmptyBoard();

  for (const [square, piece] of Object.entries(pieces) as Array<
    [Square, Piece]
  >) {
    board[square] = piece;
  }

  const castlingRights: CastlingRights = {
    whiteKingSide: false,
    whiteQueenSide: false,
    blackKingSide: false,
    blackQueenSide: false,
  };

  return {
    board,
    turn: "white",
    status: "active",
    castlingRights,
    enPassantTarget: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
    moveHistory: [],
    ...overrides,
  };
}
