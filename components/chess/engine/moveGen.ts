import type { GameState, Move, Piece, PieceType, Square } from "./types";

import { coordsToSquare, opposite, squareToCoords } from "./board";
import { isSquareAttacked } from "./attacks";

const PROMOTION_PIECES: PieceType[] = ["queen", "rook", "bishop", "knight"];

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
  ...DIAGONAL_DIRECTIONS,
  ...ORTHOGONAL_DIRECTIONS,
];

function slidingMoves(
  state: GameState,
  square: Square,
  piece: Piece,
  directions: Array<[number, number]>,
): Move[] {
  const moves: Move[] = [];
  const [fileIdx, rankIdx] = squareToCoords(square);

  for (const [df, dr] of directions) {
    let f = fileIdx + df;
    let r = rankIdx + dr;

    while (true) {
      const to = coordsToSquare(f, r);

      if (!to) break;

      const occupant = state.board[to];

      if (!occupant) {
        moves.push({ from: square, to });
      } else {
        if (occupant.color !== piece.color) {
          moves.push({ from: square, to });
        }
        break;
      }
      f += df;
      r += dr;
    }
  }

  return moves;
}

function pawnMoves(state: GameState, square: Square, piece: Piece): Move[] {
  const moves: Move[] = [];
  const [fileIdx, rankIdx] = squareToCoords(square);
  const direction = piece.color === "white" ? 1 : -1;
  const startRankIdx = piece.color === "white" ? 1 : 6;
  const promotionRankIdx = piece.color === "white" ? 7 : 0;

  const pushPawnMove = (to: Square) => {
    const [, toRankIdx] = squareToCoords(to);

    if (toRankIdx === promotionRankIdx) {
      for (const promotion of PROMOTION_PIECES) {
        moves.push({ from: square, to, promotion });
      }
    } else {
      moves.push({ from: square, to });
    }
  };

  const oneForward = coordsToSquare(fileIdx, rankIdx + direction);

  if (oneForward && state.board[oneForward] === null) {
    pushPawnMove(oneForward);

    if (rankIdx === startRankIdx) {
      const twoForward = coordsToSquare(fileIdx, rankIdx + 2 * direction);

      if (twoForward && state.board[twoForward] === null) {
        moves.push({ from: square, to: twoForward });
      }
    }
  }

  for (const fileOffset of [-1, 1]) {
    const to = coordsToSquare(fileIdx + fileOffset, rankIdx + direction);

    if (!to) continue;

    const occupant = state.board[to];

    if (occupant && occupant.color !== piece.color) {
      pushPawnMove(to);
    } else if (!occupant && to === state.enPassantTarget) {
      moves.push({ from: square, to });
    }
  }

  return moves;
}

function knightMoves(state: GameState, square: Square, piece: Piece): Move[] {
  const moves: Move[] = [];
  const [fileIdx, rankIdx] = squareToCoords(square);

  for (const [df, dr] of KNIGHT_OFFSETS) {
    const to = coordsToSquare(fileIdx + df, rankIdx + dr);

    if (!to) continue;

    const occupant = state.board[to];

    if (!occupant || occupant.color !== piece.color) {
      moves.push({ from: square, to });
    }
  }

  return moves;
}

function castlingMoves(state: GameState, square: Square, piece: Piece): Move[] {
  const moves: Move[] = [];
  const rank = piece.color === "white" ? "1" : "8";
  const opponent = opposite(piece.color);

  if (square !== (`e${rank}` as Square)) return moves;
  if (isSquareAttacked(state.board, square, opponent)) return moves;

  const kingSide =
    piece.color === "white"
      ? state.castlingRights.whiteKingSide
      : state.castlingRights.blackKingSide;
  const queenSide =
    piece.color === "white"
      ? state.castlingRights.whiteQueenSide
      : state.castlingRights.blackQueenSide;

  if (kingSide) {
    const f = `f${rank}` as Square;
    const g = `g${rank}` as Square;

    if (
      state.board[f] === null &&
      state.board[g] === null &&
      !isSquareAttacked(state.board, f, opponent) &&
      !isSquareAttacked(state.board, g, opponent)
    ) {
      moves.push({ from: square, to: g });
    }
  }

  if (queenSide) {
    const d = `d${rank}` as Square;
    const c = `c${rank}` as Square;
    const b = `b${rank}` as Square;

    if (
      state.board[d] === null &&
      state.board[c] === null &&
      state.board[b] === null &&
      !isSquareAttacked(state.board, d, opponent) &&
      !isSquareAttacked(state.board, c, opponent)
    ) {
      moves.push({ from: square, to: c });
    }
  }

  return moves;
}

function kingMoves(state: GameState, square: Square, piece: Piece): Move[] {
  const moves: Move[] = [];
  const [fileIdx, rankIdx] = squareToCoords(square);

  for (const [df, dr] of KING_OFFSETS) {
    const to = coordsToSquare(fileIdx + df, rankIdx + dr);

    if (!to) continue;

    const occupant = state.board[to];

    if (!occupant || occupant.color !== piece.color) {
      moves.push({ from: square, to });
    }
  }

  return [...moves, ...castlingMoves(state, square, piece)];
}

/** Pseudo-legal moves for the piece on `square` — does not check whether the move leaves the mover's own king in check. */
export function pseudoLegalMovesForSquare(
  state: GameState,
  square: Square,
): Move[] {
  const piece = state.board[square];

  if (!piece) return [];

  switch (piece.type) {
    case "pawn":
      return pawnMoves(state, square, piece);
    case "knight":
      return knightMoves(state, square, piece);
    case "bishop":
      return slidingMoves(state, square, piece, DIAGONAL_DIRECTIONS);
    case "rook":
      return slidingMoves(state, square, piece, ORTHOGONAL_DIRECTIONS);
    case "queen":
      return slidingMoves(state, square, piece, [
        ...DIAGONAL_DIRECTIONS,
        ...ORTHOGONAL_DIRECTIONS,
      ]);
    case "king":
      return kingMoves(state, square, piece);
    default:
      return [];
  }
}
