import {
  applyMove,
  getLegalMoves,
  type GameState,
  type Move,
  type PieceType,
  type Square,
} from "../engine";

export type Difficulty = "easy" | "medium" | "hard";

const SEARCH_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

/** Soft per-move time budget in ms; deep searches bail out of further work once exceeded. */
const TIME_BUDGET_MS: Record<Difficulty, number> = {
  easy: 500,
  medium: 1500,
  hard: 4000,
};

const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

const MATE_SCORE = 1_000_000;
const EPSILON = 1e-6;

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
const ALL_SQUARES: Square[] = FILES.flatMap((f) =>
  RANKS.map((r) => `${f}${r}` as Square),
);

function getAllLegalMoves(state: GameState): Move[] {
  const moves: Move[] = [];

  for (const square of ALL_SQUARES) {
    const piece = state.board[square];

    if (piece && piece.color === state.turn) {
      moves.push(...getLegalMoves(state, square));
    }
  }

  return moves;
}

/** Static material evaluation from white's perspective (positive favors white). */
function evaluate(state: GameState): number {
  let score = 0;

  for (const square of ALL_SQUARES) {
    const piece = state.board[square];

    if (!piece) continue;
    const value = PIECE_VALUES[piece.type];

    score += piece.color === "white" ? value : -value;
  }

  return score;
}

interface SearchContext {
  deadline: number;
}

/**
 * Negamax with alpha-beta pruning. Returns a score from the perspective of
 * `state.turn` (the side to move at this node) — positive is good for them.
 */
function negamax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  ctx: SearchContext,
): number {
  if (state.status === "checkmate") {
    return -(MATE_SCORE + depth);
  }
  if (state.status === "stalemate" || state.status === "draw") {
    return 0;
  }
  if (depth === 0 || Date.now() > ctx.deadline) {
    const perspective = state.turn === "white" ? 1 : -1;

    return evaluate(state) * perspective;
  }

  const moves = getAllLegalMoves(state);

  if (moves.length === 0) {
    return 0;
  }

  let best = -Infinity;

  for (const move of moves) {
    const { state: next, error } = applyMove(state, move);

    if (error) continue;
    const score = -negamax(next, depth - 1, -beta, -alpha, ctx);

    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }

  return best;
}

function search(state: GameState, depth: number, timeBudgetMs: number): Move {
  const moves = getAllLegalMoves(state);

  if (moves.length === 0) {
    throw new Error(
      "chooseMove: no legal moves available for the side to move",
    );
  }

  const ctx: SearchContext = { deadline: Date.now() + timeBudgetMs };

  let alpha = -Infinity;
  const beta = Infinity;
  let bestScore = -Infinity;
  let bestMoves: Move[] = [];

  for (const move of moves) {
    const { state: next, error } = applyMove(state, move);

    if (error) continue;
    const score = -negamax(next, depth - 1, -beta, -alpha, ctx);

    if (score > bestScore + EPSILON) {
      bestScore = score;
      bestMoves = [move];
    } else if (score > bestScore - EPSILON) {
      bestMoves.push(move);
    }
    if (score > alpha) alpha = score;
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/** Picks a move for the side to move in `state`. Must be a legal move per the engine. */
export async function chooseMove(
  state: GameState,
  difficulty: Difficulty,
): Promise<Move> {
  await Promise.resolve();
  const depth = SEARCH_DEPTH[difficulty];
  const timeBudgetMs = TIME_BUDGET_MS[difficulty];

  return search(state, depth, timeBudgetMs);
}
