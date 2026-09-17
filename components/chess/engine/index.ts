// =============================================================================
// TEMPORARY STUB ENGINE
// =============================================================================
// The real components/chess/engine is being built right now in a parallel
// worktree per docs/chess-architecture.md and is not merged into this branch
// yet. This file exists ONLY so the AI pane (components/chess/ai) can compile
// and be smoke-tested locally against the exact public API shape defined in
// the contract (Section 2).
//
// It implements simplified PSEUDO-LEGAL move generation only: no check/pin
// detection, no castling, no en passant, promotions always resolve to a
// queen. `getGameStatus` treats "no legal moves for the side to move" as
// stalemate (it never reports checkmate, since check detection is out of
// scope here).
//
// Do not extend this file and do not rely on its chess rules being correct —
// the supervisor will replace it wholesale with the real merged engine at
// integration time.
// =============================================================================

import type {
  Board,
  CastlingRights,
  Color,
  GameState,
  GameStatus,
  Move,
  Piece,
  PieceType,
  Square,
} from "./types";

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

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

const ALL_SQUARES: Square[] = FILES.flatMap((f) =>
  RANKS.map((r) => `${f}${r}` as Square),
);

function fileIndex(square: Square): number {
  return FILES.indexOf(square[0] as (typeof FILES)[number]);
}

function rankIndex(square: Square): number {
  return RANKS.indexOf(square[1] as (typeof RANKS)[number]);
}

function squareAt(fileIdx: number, rankIdx: number): Square | null {
  if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) return null;

  return `${FILES[fileIdx]}${RANKS[rankIdx]}` as Square;
}

export function createInitialGameState(): GameState {
  const board = {} as Board;

  for (const square of ALL_SQUARES) {
    board[square] = null;
  }

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

  const castlingRights: CastlingRights = {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
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
  };
}

function pseudoLegalMovesForPiece(
  state: GameState,
  from: Square,
  piece: Piece,
): Move[] {
  const moves: Move[] = [];
  const f = fileIndex(from);
  const r = rankIndex(from);

  const pushIfOk = (
    toF: number,
    toR: number,
    onlyIfEmpty = false,
    onlyIfCapture = false,
  ) => {
    const to = squareAt(toF, toR);

    if (!to) return;
    const occupant = state.board[to];

    if (onlyIfEmpty && occupant) return;
    if (onlyIfCapture && (!occupant || occupant.color === piece.color)) return;
    if (occupant && occupant.color === piece.color) return;
    if (piece.type === "pawn" && (toR === 0 || toR === 7)) {
      moves.push({ from, to, promotion: "queen" });
    } else {
      moves.push({ from, to });
    }
  };

  const slide = (directions: Array<[number, number]>) => {
    for (const [df, dr] of directions) {
      let toF = f + df;
      let toR = r + dr;

      while (true) {
        const to = squareAt(toF, toR);

        if (!to) break;
        const occupant = state.board[to];

        if (!occupant) {
          moves.push({ from, to });
        } else {
          if (occupant.color !== piece.color) moves.push({ from, to });
          break;
        }
        toF += df;
        toR += dr;
      }
    }
  };

  switch (piece.type) {
    case "pawn": {
      const dir = piece.color === "white" ? 1 : -1;
      const startRank = piece.color === "white" ? 1 : 6;
      const oneAhead = squareAt(f, r + dir);

      if (oneAhead && !state.board[oneAhead]) {
        pushIfOk(f, r + dir, true);
        if (r === startRank) {
          const twoAhead = squareAt(f, r + 2 * dir);

          if (twoAhead && !state.board[twoAhead]) {
            pushIfOk(f, r + 2 * dir, true);
          }
        }
      }
      for (const df of [-1, 1]) {
        pushIfOk(f + df, r + dir, false, true);
      }
      break;
    }
    case "knight": {
      const deltas: Array<[number, number]> = [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2],
      ];

      for (const [df, dr] of deltas) pushIfOk(f + df, r + dr);
      break;
    }
    case "bishop":
      slide([
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      break;
    case "rook":
      slide([
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
      break;
    case "queen":
      slide([
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
      break;
    case "king": {
      const deltas: Array<[number, number]> = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
      ];

      for (const [df, dr] of deltas) pushIfOk(f + df, r + dr);
      break;
    }
  }

  return moves;
}

/** Legal destination moves for the piece currently on `square`, given check rules. Empty array if no piece, wrong turn, or no legal moves. */
export function getLegalMoves(state: GameState, square: Square): Move[] {
  const piece = state.board[square];

  if (!piece || piece.color !== state.turn) return [];

  return pseudoLegalMovesForPiece(state, square, piece);
}

function hasAnyLegalMove(state: GameState): boolean {
  for (const square of ALL_SQUARES) {
    const piece = state.board[square];

    if (
      piece &&
      piece.color === state.turn &&
      getLegalMoves(state, square).length > 0
    ) {
      return true;
    }
  }

  return false;
}

/** Convenience accessor; must agree with `state.status`. */
export function getGameStatus(state: GameState): GameStatus {
  if (!hasAnyLegalMove(state)) return "stalemate";

  return "active";
}

/**
 * Attempts to apply `move` to `state`. Returns a new GameState on success.
 * On an illegal move, returns the original `state` unchanged plus `error`
 * describing why (e.g. "not your turn", "illegal move", "leaves king in check").
 */
export function applyMove(
  state: GameState,
  move: Move,
): { state: GameState; error?: string } {
  const piece = state.board[move.from];

  if (!piece) return { state, error: "no piece on from-square" };
  if (piece.color !== state.turn) return { state, error: "not your turn" };

  const legal = getLegalMoves(state, move.from);
  const matches = legal.some(
    (m) => m.to === move.to && m.promotion === move.promotion,
  );

  if (!matches) return { state, error: "illegal move" };

  const board: Board = { ...state.board };
  const captured = board[move.to];
  const movedPiece: Piece = move.promotion
    ? { type: move.promotion, color: piece.color }
    : piece;

  board[move.to] = movedPiece;
  board[move.from] = null;

  const isPawnMove = piece.type === "pawn";
  const halfmoveClock = isPawnMove || captured ? 0 : state.halfmoveClock + 1;
  const nextTurn: Color = state.turn === "white" ? "black" : "white";
  const fullmoveNumber =
    state.turn === "black" ? state.fullmoveNumber + 1 : state.fullmoveNumber;

  const nextState: GameState = {
    board,
    turn: nextTurn,
    status: "active",
    castlingRights: { ...state.castlingRights },
    enPassantTarget: null,
    halfmoveClock,
    fullmoveNumber,
    moveHistory: [...state.moveHistory, move],
  };

  nextState.status = getGameStatus(nextState);

  return { state: nextState };
}
