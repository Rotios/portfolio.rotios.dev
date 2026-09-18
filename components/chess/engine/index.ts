import type { CastlingRights, GameState, Move, Square } from "./types";

import { createInitialBoard } from "./board";
import { applyMoveToBoard } from "./apply";
import { pseudoLegalMovesForSquare } from "./moveGen";
import { computeStatus, legalMovesForSquare } from "./legal";

export type {
  Board,
  CastlingRights,
  Color,
  File,
  GameState,
  GameStatus,
  Move,
  Piece,
  PieceType,
  Rank,
  Square,
} from "./types";

export function createInitialGameState(): GameState {
  const castlingRights: CastlingRights = {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
  };

  return {
    board: createInitialBoard(),
    turn: "white",
    status: "active",
    castlingRights,
    enPassantTarget: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
    moveHistory: [],
  };
}

function updateCastlingRights(
  rights: CastlingRights,
  move: Move,
): CastlingRights {
  const next = { ...rights };

  if (move.from === "e1") {
    next.whiteKingSide = false;
    next.whiteQueenSide = false;
  }
  if (move.from === "e8") {
    next.blackKingSide = false;
    next.blackQueenSide = false;
  }
  if (move.from === "a1" || move.to === "a1") next.whiteQueenSide = false;
  if (move.from === "h1" || move.to === "h1") next.whiteKingSide = false;
  if (move.from === "a8" || move.to === "a8") next.blackQueenSide = false;
  if (move.from === "h8" || move.to === "h8") next.blackKingSide = false;

  return next;
}

export function getLegalMoves(state: GameState, square: Square): Move[] {
  const piece = state.board[square];

  if (!piece || piece.color !== state.turn) return [];

  return legalMovesForSquare(state, square);
}

export function getGameStatus(state: GameState): GameState["status"] {
  return state.status;
}

export function applyMove(
  state: GameState,
  move: Move,
): { state: GameState; error?: string } {
  const piece = state.board[move.from];

  if (!piece) {
    return { state, error: "illegal move" };
  }
  if (piece.color !== state.turn) {
    return { state, error: "not your turn" };
  }

  const legalMoves = legalMovesForSquare(state, move.from);
  const matched = legalMoves.find(
    (m) => m.to === move.to && m.promotion === move.promotion,
  );

  if (!matched) {
    const pseudoLegal = pseudoLegalMovesForSquare(state, move.from);
    const reachable = pseudoLegal.some((m) => m.to === move.to);

    if (reachable) {
      return { state, error: "leaves king in check" };
    }

    return { state, error: "illegal move" };
  }

  const isCapture =
    state.board[move.to] !== null ||
    (piece.type === "pawn" && move.to === state.enPassantTarget);
  const newBoard = applyMoveToBoard(
    state.board,
    matched,
    state.enPassantTarget,
  );
  const newCastlingRights = updateCastlingRights(state.castlingRights, matched);

  let newEnPassantTarget: Square | null = null;

  if (piece.type === "pawn") {
    const fromRank = Number(move.from[1]);
    const toRank = Number(move.to[1]);

    if (Math.abs(toRank - fromRank) === 2) {
      const passedRank = (fromRank + toRank) / 2;

      newEnPassantTarget = `${move.from[0]}${passedRank}` as Square;
    }
  }

  const newHalfmoveClock =
    piece.type === "pawn" || isCapture ? 0 : state.halfmoveClock + 1;
  const newFullmoveNumber =
    piece.color === "black" ? state.fullmoveNumber + 1 : state.fullmoveNumber;
  const newTurn = piece.color === "white" ? "black" : "white";

  const nextState: GameState = {
    board: newBoard,
    turn: newTurn,
    status: "active",
    castlingRights: newCastlingRights,
    enPassantTarget: newEnPassantTarget,
    halfmoveClock: newHalfmoveClock,
    fullmoveNumber: newFullmoveNumber,
    moveHistory: [...state.moveHistory, matched],
  };

  nextState.status = computeStatus(nextState);

  return { state: nextState };
}
