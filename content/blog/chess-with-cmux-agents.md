---
title: "Getting the Most Out of CMUX with Claude: I Let Three Agents Build a Chess Game"
summary: "Testing autonomous multi-agent orchestration in CMUX by having a supervisor Claude split a chess game across three parallel worktrees — engine, AI, and UI."
date: "2026-09-17"
aiGenerated: true
---

## The thing I was itching to try

Last post I mentioned that workspaces alone were only touching the surface of what CMUX could do, and that the feature I really wanted to explore was fully autonomous agent orchestration via the CMUX CLI — one Claude session directing several others, each in its own git worktree, without me babysitting every pane. This post is that experiment.

I needed a project with a shape that actually justifies splitting across agents: a few pieces that are meaningfully independent but have to agree on an interface. Chess turned out to be perfect for this. A chess game is really three separable problems — the rules engine (board state, legal moves, check/checkmate detection), an AI opponent that sits on top of the engine, and a UI that wires both together — that all have to agree on the same contract to ever come back together. So the brief became: **a basic chess game, built from scratch, with three agents working in parallel worktrees on the engine, the AI, and the UI, coordinated by a fourth "supervisor" agent.**

## The prompt

I didn't want the three agents negotiating the interface live mid-build — that's exactly the kind of thing that produces rework and merge conflicts. So I wrote out a full supervisor playbook up front: write the architecture contract first and commit it before spawning anyone, split real file-ownership boundaries so no two worktrees can touch the same file, require a verification gate (lint, typecheck, tests, a real dev-server smoke check) before any pane is allowed to call itself done, and merge everything back into `main` myself in a specific order. Here's the actual prompt, unedited:

```markdown
# Supervisor Agent Instructions — Chess Game (cmux multi-agent build)

You are the CMUX Supervisor Agent for this repo (`portfolio.rotios.dev`, a Next.js 14 App Router site using TypeScript, Tailwind, and HeroUI). Your job is to orchestrate three parallel sub-agents in separate git worktrees to build a chess game, then integrate their work into `main` yourself.

## Repo conventions to enforce on every sub-agent

- Next.js 14 App Router, TypeScript, Tailwind, HeroUI components (`@heroui/*`) — match the existing `Minesweeper` project's style (`app/projects/minesweeper/`, `components/minesweeper/`).
- No new dependencies beyond what's already in `package.json` unless a pane justifies it to you first (e.g. a test runner — see Phase 0).
- New chess-related routes/components must follow the existing project pattern, not invent a new one.

## Phase 0 — Write the architecture contract yourself, before spawning anything

Do not let the three panes negotiate the interface live — that produces rework and merge conflicts. Before creating any worktree, write `docs/chess-architecture.md` (create the `docs/` dir if needed) on `main`, commit it, and require every pane to read it as their first action. It must pin down:

1. **Core types** — `Color`, `PieceType`, `Piece`, `Square` (algebraic, e.g. `"e4"`), `Board`, `Move { from, to, promotion? }`, `GameStatus` (`active | check | checkmate | stalemate | draw`).
2. **Engine public API** (`components/chess/engine/index.ts`): `createInitialGameState()`, `applyMove(state, move): { state, error? }`, `getLegalMoves(state, square)`, `getGameStatus(state)`. AI and UI may only import from this file's exports — never reach into engine internals.
3. **AI public API** (`components/chess/ai/index.ts`): `chooseMove(state: GameState, difficulty: Difficulty): Promise<Move>`, implemented as minimax with alpha-beta pruning. Depth/difficulty levels are the AI pane's call, but the function signature is fixed here.
4. **File ownership boundaries** (this is what keeps the three worktrees from touching the same files):
   - **Engine pane** owns `components/chess/engine/**` only.
   - **AI pane** owns `components/chess/ai/**` only, and may only import from `components/chess/engine`.
   - **UI pane** owns `app/projects/chess/**` and `components/chess/ui/**`, wires the engine + AI together, and is the *only* pane that edits `config/projects.ts` (add a Chess entry matching the Minesweeper one) and root files like `package.json`/`README.md` if a UI dependency is truly needed.
   - Exception: the engine pane may add a lightweight test runner (see Phase 5) to `package.json`, since it merges first — see Phase 6 ordering.
5. **Status-report format** each pane must echo to its terminal so the supervisor can parse it via `cmux read-screen`, e.g. `STATUS: <pane> <phase> <detail>`.

## Phase 1 — Worktrees

From `main` (after committing `docs/chess-architecture.md`), create three branches and worktrees:

git worktree add -b chess-engine .worktrees/engine
git worktree add -b chess-ui .worktrees/ui
git worktree add -b chess-ai .worktrees/ai

## Phase 2 — Spawn panes

For each worktree, open a workspace and launch an interactive Claude Code session in auto mode:

cmux new-workspace --name "Chess Engine" --cwd .worktrees/engine --command "claude --permission-mode auto"
cmux new-workspace --name "Chess UI"     --cwd .worktrees/ui     --command "claude --permission-mode auto"
cmux new-workspace --name "Chess AI"     --cwd .worktrees/ai     --command "claude --permission-mode auto"

Note the workspace/surface refs each call returns — you need them as `--workspace`/`--surface` targets for every `cmux send` / `cmux read-screen` below.

## Phase 3 — Initial prompts

Send each pane a prompt via `cmux send --workspace <ref> "<prompt>\n"` that includes:

- Instruction to read `docs/chess-architecture.md` first.
- Its file ownership boundary from Phase 0 (do not touch files outside it).
- Its concrete task:
  - **Engine**: board state, move generation, check/checkmate/stalemate detection, matching the engine API exactly.
  - **UI**: chessboard rendering and game controls using HeroUI, built against the engine API (assume it exists per the contract even before it's merged — you'll integrate for real in Phase 6), plus the `config/projects.ts` entry and `app/projects/chess/page.tsx`.
  - **AI**: minimax + alpha-beta opponent built against the engine API, exposing `chooseMove`.
- Instruction to emit `STATUS:` lines per the Phase 0 format, and to run `cmux notify --title "<pane>" --body "<milestone>"` at major milestones so you don't have to poll constantly.

## Phase 4 — Monitoring

Poll with `cmux read-screen --workspace <ref> --scrollback --lines 200` rather than sitting idle. Use `cmux set-progress <0-1> --label "<text>"` on your own supervisor workspace to reflect overall build progress.

## Phase 5 — Verification gate (required before any pane reports done)

No pane may declare itself finished without, in its own worktree:

1. `npm run lint` passing.
2. `npm run build` passing (or `tsc --noEmit` at minimum).
3. Automated tests passing. There is currently no test runner in this repo — the **engine pane** is responsible for adding one (prefer `vitest`, minimal footprint) and writing unit tests for move generation, check detection, checkmate, and stalemate, since that logic is the highest-value thing to cover. UI/AI panes add at least a smoke test for their piece once the runner exists.
4. A manual dev-server smoke check: start `npm run dev` in the background, curl the relevant route, confirm a non-error response, then kill the server. (Mirror the pattern already used in `.claude/settings.local.json`.)

Only after all four pass should a pane report `STATUS: <pane> done`.

## Phase 6 — Integration (you merge directly to main, no PRs)

Merge order matters because of the ownership boundaries in Phase 0:

1. **Engine first** — `git checkout main && git merge chess-engine`. Run lint/build/tests/dev-smoke-check yourself on `main` before continuing.
2. **AI second** — merge `chess-ai`, re-verify.
3. **UI last** — merge `chess-ui`. This is where the UI's engine/AI imports go from "assumed API" to "real, merged code" — re-verify, and specifically confirm the UI actually compiles against the real (not assumed) engine/AI exports. Fix small drift yourself (e.g. a renamed parameter); don't kick it back to a pane for a one-line fix.

After all three are merged, run the full verification suite (lint, build, tests, dev-server smoke check hitting `/projects/chess`) once more on `main`. Then remove the worktrees and delete the merged branches:

git worktree remove .worktrees/engine .worktrees/ui .worktrees/ai
git branch -d chess-engine chess-ui chess-ai

## Escalation criteria

Handle yourself: import path drift, naming mismatches, formatting/lint conflicts, small type mismatches between the contract and what a pane actually built.

Halt auto mode and escalate to me if: a pane needs to deviate from the Phase 0 contract in a way that changes another pane's public API, a pane wants to add a dependency not already in `package.json`, or a merge conflict can't be resolved without picking one pane's architecture over another's.

## Completion criteria

- `/projects/chess` is live, listed on `/projects` via `config/projects.ts`, playable end-to-end (human vs. AI), matches the site's existing HeroUI/Tailwind look.
- `npm run lint`, `npm run build`, and the new test suite all pass on `main`.
- Worktrees and branches cleaned up.
```

## What actually happened

I dropped that prompt on a fresh Claude Code session and let it run in auto mode. It wrote the architecture contract first, committed it, then spun up three real `cmux` workspaces — one per worktree — each running its own `claude --permission-mode auto` session, and sent each one its scoped task. From there I mostly watched an event stream instead of babysitting three terminals: permission requests, turn-completions, and milestone notifications, with escalation reserved for anything that would change another pane's public API.

The engine pane wrote its own board representation, move generation, attack detection, and check/checkmate/stalemate logic from scratch — no `chess.js`, no chess library of any kind — plus 25 vitest unit tests covering fool's mate, back-rank mate, castling through check, en passant, and promotion. The AI pane implemented negamax with alpha-beta pruning against the contract's `chooseMove` signature. The UI pane built the board and controls in HeroUI, matching the site's existing Minesweeper page.

The genuinely interesting part was what went wrong. Because all three worktrees live nested under the main repo directory, ESLint's config resolution walked *up* from each worktree, found the outer repo's `.eslintrc.json` too, and loaded `eslint-plugin-react` from two different `node_modules` trees at once — a "couldn't determine the plugin uniquely" failure in every single worktree. I found this myself while re-verifying the engine merge on `main`; independently, the engine pane had already hit and fixed the exact same thing in its own worktree before I even looked. Small thing, but it's the kind of infrastructure gotcha that's easy to miss when you're used to a single working tree, and having it show up twice, independently, was a good sign the setup was sound.

The other interesting moment was the merge itself. The AI pane, working before the real engine existed yet, had (correctly, per the contract) stubbed out a temporary fake engine just so it could compile and test `chooseMove` locally — clearly labeled, meant to be thrown away at integration time. Merging `chess-ai` into `main` after `chess-engine` was already there produced exactly the conflict you'd expect: the AI's stub engine files collided with the real ones. That's precisely the kind of conflict the contract anticipated, and resolving it was mechanical — keep the real engine, drop the stub, confirm the AI's exports still typecheck against it.

## Playing it — and finding a real bug by actually playing it

Code review and passing tests only tell you so much. So I opened the finished game in a real browser and played a full game against it, move by move, clicking through the actual UI instead of assuming it worked. I made real mistakes doing this — missed a rook's control of an open file, walked my own rook into a square its opponent could just take — and the engine caught every single one of them correctly. That's a good sign for a from-scratch rules implementation.

It also caught a UI bug that no amount of reading the code would have surfaced. After a few real moves, the game got stuck permanently on "AI is thinking…" — board disabled, nothing clickable. It turned out to be a stale-closure race in the effect that triggers the AI's move: a branch that runs whenever it's *not* the AI's turn never reset the "thinking" flag, and if that effect got re-invoked while an AI move was still in flight (a dev-mode hot-reload landing at the wrong moment, most likely), the flag could get permanently stranded at `true` with nothing left to ever clear it. I reproduced it, fixed it, then deliberately forced a reload mid-AI-turn to confirm it actually holds up under the exact failure condition. That's the kind of bug that only shows up from someone actually using the thing.

## The part where I have notes for the AI

I'll be honest: the chess AI is not good. Tactically it's fine within its search depth, but I got it down to a completely won endgame — king and rook against a bare king — and even on the hardest difficulty setting it just couldn't finish the game. It would shuffle its rook back and forth for move after move without ever cornering my king. The reason turned out to be simple once I dug into it: its evaluation function only counts material. Once it's already up a full rook, every legal move scores identically in its eyes, so there's no signal at all pulling it toward an actual mate — depth alone can't fix that, since a real mate-in-N from an arbitrary winning position is often ten-plus moves deep, well beyond what a few plies of search can see without something like a king-distance term to point it in the right direction. A real fix would need a bit of positional evaluation, not just more depth. That one's still open.

## Try it

It's live at [/projects/chess](/projects/chess) — pick your side, pick a difficulty, and see if you can spot the same endgame weakness I did.

The bigger takeaway for me wasn't the chess game itself, it was the orchestration pattern: a supervisor agent that writes the contract first, splits work across truly isolated worktrees by file ownership rather than by vibes, and only merges after a real verification gate. That's a shape I plan on reusing for a lot more than chess.
