import type { Board, Move, Square } from "./types";

import { cloneBoard, squareToCoords } from "./board";

/** Pure board transform for `move` — handles en passant capture and castling rook movement. Does not validate legality. */
export function applyMoveToBoard(
  board: Board,
  move: Move,
  enPassantTarget: Square | null,
): Board {
  const newBoard = cloneBoard(board);
  const piece = newBoard[move.from];

  if (!piece) return newBoard;

  if (
    piece.type === "pawn" &&
    move.to === enPassantTarget &&
    board[move.to] === null
  ) {
    const capturedSquare = `${move.to[0]}${move.from[1]}` as Square;

    newBoard[capturedSquare] = null;
  }

  if (piece.type === "king") {
    const [fromFile] = squareToCoords(move.from);
    const [toFile] = squareToCoords(move.to);

    if (Math.abs(toFile - fromFile) === 2) {
      const rank = move.from[1];

      if (toFile > fromFile) {
        const rookFrom = `h${rank}` as Square;
        const rookTo = `f${rank}` as Square;

        newBoard[rookTo] = newBoard[rookFrom];
        newBoard[rookFrom] = null;
      } else {
        const rookFrom = `a${rank}` as Square;
        const rookTo = `d${rank}` as Square;

        newBoard[rookTo] = newBoard[rookFrom];
        newBoard[rookFrom] = null;
      }
    }
  }

  newBoard[move.to] = move.promotion
    ? { type: move.promotion, color: piece.color }
    : piece;
  newBoard[move.from] = null;

  return newBoard;
}
