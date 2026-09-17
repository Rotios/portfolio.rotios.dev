import type { Board, Color, Square } from "./types";

import { coordsToSquare, squareToCoords } from "./board";

const KNIGHT_OFFSETS: Array<[number, number]> = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
];

const KING_OFFSETS: Array<[number, number]> = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

const DIAGONAL_DIRECTIONS: Array<[number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const ORTHOGONAL_DIRECTIONS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/** Whether any piece of `byColor` attacks `square` on `board`. */
export function isSquareAttacked(
  board: Board,
  square: Square,
  byColor: Color,
): boolean {
  const [fileIdx, rankIdx] = squareToCoords(square);
  const pawnRankOffset = byColor === "white" ? -1 : 1;

  for (const fileOffset of [-1, 1]) {
    const from = coordsToSquare(fileIdx + fileOffset, rankIdx + pawnRankOffset);

    if (from) {
      const piece = board[from];

      if (piece && piece.type === "pawn" && piece.color === byColor) {
        return true;
      }
    }
  }

  for (const [df, dr] of KNIGHT_OFFSETS) {
    const from = coordsToSquare(fileIdx + df, rankIdx + dr);

    if (from) {
      const piece = board[from];

      if (piece && piece.type === "knight" && piece.color === byColor) {
        return true;
      }
    }
  }

  for (const [df, dr] of KING_OFFSETS) {
    const from = coordsToSquare(fileIdx + df, rankIdx + dr);

    if (from) {
      const piece = board[from];

      if (piece && piece.type === "king" && piece.color === byColor) {
        return true;
      }
    }
  }

  for (const [df, dr] of DIAGONAL_DIRECTIONS) {
    let f = fileIdx + df;
    let r = rankIdx + dr;

    while (true) {
      const current = coordsToSquare(f, r);

      if (!current) break;

      const piece = board[current];

      if (piece) {
        if (
          piece.color === byColor &&
          (piece.type === "bishop" || piece.type === "queen")
        ) {
          return true;
        }
        break;
      }
      f += df;
      r += dr;
    }
  }

  for (const [df, dr] of ORTHOGONAL_DIRECTIONS) {
    let f = fileIdx + df;
    let r = rankIdx + dr;

    while (true) {
      const current = coordsToSquare(f, r);

      if (!current) break;

      const piece = board[current];

      if (piece) {
        if (
          piece.color === byColor &&
          (piece.type === "rook" || piece.type === "queen")
        ) {
          return true;
        }
        break;
      }
      f += df;
      r += dr;
    }
  }

  return false;
}
