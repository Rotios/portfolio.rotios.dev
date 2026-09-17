# Chess Architecture Contract

This document is the single source of truth for the chess feature build. It is
written and committed to `main` **before** any worktree/pane exists. All three
panes (engine, ai, ui) must read this file as their first action and build
against it exactly — do not renegotiate these signatures live between panes.

Repo conventions apply: Next.js 14 App Router, TypeScript, Tailwind, HeroUI
(`@heroui/*`). Match the existing Minesweeper project's structure
(`app/projects/minesweeper/`, `components/minesweeper/`). No new dependencies
beyond what's already in `package.json`, except the one exception called out
below (engine pane adding a test runner).

## 1. Core types

Create these in `components/chess/engine/types.ts` and re-export them from
`components/chess/engine/index.ts`. Every pane imports these types from
`components/chess/engine` — never redefine them locally.

```ts
export type Color = "white" | "black";

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

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

export type GameStatus = "active" | "check" | "checkmate" | "stalemate" | "draw";

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
```

Starting position: standard chess setup, white on ranks 1–2, black on ranks
7–8, white moves first (`turn: "white"`), `status: "active"`, all four
castling rights `true`, `enPassantTarget: null`, `halfmoveClock: 0`,
`fullmoveNumber: 1`, `moveHistory: []`.

## 2. Engine public API — `components/chess/engine/index.ts`

This is the **only** file AI and UI panes may import from for engine
functionality. Never reach into `components/chess/engine/*` internals
(board representation, move-gen helpers, etc.) from outside the engine pane.

```ts
export function createInitialGameState(): GameState;

/**
 * Attempts to apply `move` to `state`. Returns a new GameState on success.
 * On an illegal move, returns the original `state` unchanged plus `error`
 * describing why (e.g. "not your turn", "illegal move", "leaves king in check").
 */
export function applyMove(state: GameState, move: Move): { state: GameState; error?: string };

/** Legal destination moves for the piece currently on `square`, given check rules. Empty array if no piece, wrong turn, or no legal moves. */
export function getLegalMoves(state: GameState, square: Square): Move[];

/** Convenience accessor; must agree with `state.status`. */
export function getGameStatus(state: GameState): GameStatus;
```

Engine responsibilities: full board state, legal move generation for every
piece type (including castling, en passant, promotion), check detection,
checkmate detection, stalemate detection, and the 50-move/insufficient-material
draw cases if time allows (not required for v1 — `draw` status existing is
enough, engine pane's call on which draw conditions it implements first).

## 3. AI public API — `components/chess/ai/index.ts`

The **only** file UI may import from for AI functionality. AI pane may import
types and functions only from `components/chess/engine` — never from UI or
engine internals.

```ts
export type Difficulty = "easy" | "medium" | "hard";

/** Picks a move for the side to move in `state`. Must be a legal move per the engine. */
export function chooseMove(state: GameState, difficulty: Difficulty): Promise<Move>;
```

Implementation: minimax with alpha-beta pruning. Search depth per difficulty
level is the AI pane's call (e.g. easy=1–2 ply, medium=3, hard=4+), and may
factor in a move time budget. The function must be `async` regardless of
whether the search itself is synchronous, so UI can `await` it without
blocking on a slow search (wrap in a microtask / `Promise.resolve` at minimum).

## 4. File ownership boundaries

Strict — this is what keeps three parallel worktrees from touching the same
files. Do not edit files outside your pane's boundary.

| Pane | Owns | May import from |
|---|---|---|
| **Engine** | `components/chess/engine/**` | nothing project-local (pure logic) |
| **AI** | `components/chess/ai/**` | `components/chess/engine` only |
| **UI** | `app/projects/chess/**`, `components/chess/ui/**`, `config/projects.ts`, root files (`package.json`/`README.md`) *only if truly needed* | `components/chess/engine`, `components/chess/ai` |

Exception: the engine pane may add a lightweight test runner to
`package.json` (prefer `vitest`, minimal footprint) since engine merges
first — see Phase 6 merge order in `prompt.md`. No other pane may touch
`package.json` for new dependencies without supervisor sign-off.

The UI pane builds against this contract as if the engine/AI exports already
exist, even before those branches are merged — real integration happens when
the supervisor merges engine → ai → ui into `main`.

### UI integration notes

- New route: `app/projects/chess/page.tsx` (+ `layout.tsx` if needed),
  following the Minesweeper pattern (`app/projects/minesweeper/page.tsx`):
  a `title()` heading, short description, then the game component.
- Add a `Chess` entry to `config/projects.ts` (`ProjectConfig`), matching the
  shape of the existing Minesweeper entry (`name`, `summary`, `description`,
  `href: '/projects/chess'`, `imageSrc`).
- Use HeroUI components (`@heroui/button`, `@heroui/card`, `@heroui/chip`,
  `@heroui/switch`, etc. — whatever's already a dependency) for controls:
  difficulty selector, new game button, status/turn indicator, captured
  pieces, promotion choice, etc. Match Minesweeper's use of HeroUI
  Input/Chip/Kbd for a consistent look.
- The board itself can be plain Tailwind-styled divs/buttons (no HeroUI board
  primitive exists) — square color, piece glyphs or a simple SVG/Unicode set,
  click-to-select then click-to-move (or drag, UI pane's call).

## 5. Status-report format

Every pane echoes progress to its own terminal in this exact format so the
supervisor can parse it via `cmux read-screen`:

```
STATUS: <pane> <phase> <detail>
```

Where `<pane>` is `engine`, `ai`, or `ui`; `<phase>` is a short slug (e.g.
`setup`, `implementing`, `testing`, `verifying`, `done`); `<detail>` is a
short free-text note. Example:

```
STATUS: engine implementing move-generation-complete
STATUS: engine testing checkmate-stalemate-tests-passing
STATUS: engine done
```

Panes should also run `cmux notify --title "<pane>" --body "<milestone>"` at
major milestones (task started, verification gate passed, done) so the
supervisor doesn't have to poll constantly.

No pane may emit `STATUS: <pane> done` until it has passed the full
verification gate (lint, build/typecheck, tests, dev-server smoke check) —
see Phase 5 in `prompt.md`.
