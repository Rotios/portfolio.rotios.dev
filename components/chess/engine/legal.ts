import type { Color, GameState, GameStatus, Move, Square } from "./types";

import { ALL_SQUARES, findKing, opposite } from "./board";
import { isSquareAttacked } from "./attacks";
import { applyMoveToBoard } from "./apply";
import { pseudoLegalMovesForSquare } from "./moveGen";

export function isInCheck(state: GameState, color: Color): boolean {
  const kingSquare = findKing(state.board, color);

  if (!kingSquare) return false;

  return isSquareAttacked(state.board, kingSquare, opposite(color));
}

function wouldLeaveKingInCheck(
  state: GameState,
  move: Move,
  color: Color,
): boolean {
  const nextBoard = applyMoveToBoard(state.board, move, state.enPassantTarget);
  const kingSquare = findKing(nextBoard, color);

  if (!kingSquare) return true;

  return isSquareAttacked(nextBoard, kingSquare, opposite(color));
}

/** Fully legal moves for the piece on `square`, regardless of whose turn it is. */
export function legalMovesForSquare(state: GameState, square: Square): Move[] {
  const piece = state.board[square];

  if (!piece) return [];

  return pseudoLegalMovesForSquare(state, square).filter(
    (move) => !wouldLeaveKingInCheck(state, move, piece.color),
  );
}

export function hasAnyLegalMove(state: GameState, color: Color): boolean {
  for (const square of ALL_SQUARES) {
    const piece = state.board[square];

    if (
      piece &&
      piece.color === color &&
      legalMovesForSquare(state, square).length > 0
    ) {
      return true;
    }
  }

  return false;
}

function isInsufficientMaterial(state: GameState): boolean {
  const pieces = ALL_SQUARES.map((square) => state.board[square]).filter(
    (piece) => piece !== null,
  );

  if (pieces.length > 4) return false;

  const nonKingPieces = pieces.filter((piece) => piece!.type !== "king");

  if (nonKingPieces.length === 0) return true;
  if (nonKingPieces.length === 1) {
    const type = nonKingPieces[0]!.type;

    return type === "bishop" || type === "knight";
  }

  return false;
}

export function computeStatus(state: GameState): GameStatus {
  const color = state.turn;
  const inCheck = isInCheck(state, color);
  const hasMoves = hasAnyLegalMove(state, color);

  if (!hasMoves) {
    return inCheck ? "checkmate" : "stalemate";
  }

  if (state.halfmoveClock >= 100 || isInsufficientMaterial(state)) {
    return "draw";
  }

  return inCheck ? "check" : "active";
}
