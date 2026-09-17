import { describe, expect, it } from "vitest";

import { applyMove, createInitialGameState, getLegalMoves } from "../index";

import { buildState } from "./helpers";

describe("applyMove error handling", () => {
  it("rejects moving the opponent's piece", () => {
    const state = createInitialGameState();
    const result = applyMove(state, { from: "e7", to: "e5" });

    expect(result.error).toBe("not your turn");
    expect(result.state).toBe(state);
  });

  it("rejects a move the piece cannot reach", () => {
    const state = createInitialGameState();
    const result = applyMove(state, { from: "e2", to: "e5" });

    expect(result.error).toBe("illegal move");
    expect(result.state).toBe(state);
  });

  it("rejects a move from an empty square", () => {
    const state = createInitialGameState();
    const result = applyMove(state, { from: "e4", to: "e5" });

    expect(result.error).toBe("illegal move");
  });

  it("rejects a pseudo-legal move that leaves the king in check", () => {
    const state = buildState({
      e1: { type: "king", color: "white" },
      e2: { type: "rook", color: "white" },
      e8: { type: "rook", color: "black" },
      a8: { type: "king", color: "black" },
    });
    const result = applyMove(state, { from: "e2", to: "d2" });

    expect(result.error).toBe("leaves king in check");
    expect(result.state).toBe(state);

    const pinnedMoves = getLegalMoves(state, "e2")
      .map((m) => m.to)
      .sort();

    expect(pinnedMoves).toEqual(["e3", "e4", "e5", "e6", "e7", "e8"]);
  });
});
