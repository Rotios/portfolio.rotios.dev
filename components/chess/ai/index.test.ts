import { describe, expect, it } from "vitest";

import { applyMove, createInitialGameState, getLegalMoves } from "../engine";

import { chooseMove } from "./index";

const DIFFICULTIES: Array<"easy" | "medium" | "hard"> = [
  "easy",
  "medium",
  "hard",
];

describe("chooseMove", () => {
  it.each(DIFFICULTIES)(
    "returns a legal move for the side to move at %s difficulty",
    async (difficulty) => {
      const state = createInitialGameState();
      const move = await chooseMove(state, difficulty);

      const legal = getLegalMoves(state, move.from);

      expect(legal.some((m) => m.to === move.to)).toBe(true);

      const { error } = applyMove(state, move);

      expect(error).toBeUndefined();
    },
  );

  it("is genuinely async (resolves via microtask, not synchronously)", () => {
    const state = createInitialGameState();
    let resolved = false;
    const promise = chooseMove(state, "easy").then((move) => {
      resolved = true;

      return move;
    });

    expect(resolved).toBe(false);

    return promise;
  });

  it("can play a short self-play game without crashing", async () => {
    let state = createInitialGameState();

    for (
      let i = 0;
      i < 6 && state.status !== "checkmate" && state.status !== "stalemate";
      i++
    ) {
      const move = await chooseMove(state, "easy");
      const result = applyMove(state, move);

      expect(result.error).toBeUndefined();
      state = result.state;
    }
    expect(state.moveHistory.length).toBeGreaterThan(0);
  });
});
