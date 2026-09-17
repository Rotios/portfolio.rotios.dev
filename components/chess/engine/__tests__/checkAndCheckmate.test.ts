import { describe, expect, it } from "vitest";

import { applyMove, createInitialGameState } from "../index";
import { computeStatus, isInCheck } from "../legal";

import { buildState } from "./helpers";

describe("check detection", () => {
  it("detects a rook check along an open file", () => {
    const state = buildState({
      e1: { type: "king", color: "white" },
      e8: { type: "rook", color: "black" },
      a8: { type: "king", color: "black" },
    });

    expect(isInCheck(state, "white")).toBe(true);
    expect(computeStatus(state)).toBe("check");
  });

  it("is not in check when no attacker has a line to the king", () => {
    const state = buildState({
      e1: { type: "king", color: "white" },
      a8: { type: "king", color: "black" },
      a7: { type: "rook", color: "black" },
    });

    expect(isInCheck(state, "white")).toBe(false);
    expect(computeStatus(state)).toBe("active");
  });
});

describe("checkmate detection", () => {
  it("detects fool's mate via the public applyMove pipeline", () => {
    let result = applyMove(createInitialGameState(), { from: "f2", to: "f3" });

    expect(result.error).toBeUndefined();
    result = applyMove(result.state, { from: "e7", to: "e5" });
    expect(result.error).toBeUndefined();
    result = applyMove(result.state, { from: "g2", to: "g4" });
    expect(result.error).toBeUndefined();
    result = applyMove(result.state, { from: "d8", to: "h4" });
    expect(result.error).toBeUndefined();

    expect(result.state.status).toBe("checkmate");
    expect(result.state.turn).toBe("white");
  });

  it("recognizes a back-rank checkmate on a constructed position", () => {
    const state = buildState({
      h1: { type: "king", color: "white" },
      g2: { type: "pawn", color: "white" },
      h2: { type: "pawn", color: "white" },
      a1: { type: "rook", color: "black" },
      h8: { type: "king", color: "black" },
    });

    expect(computeStatus(state)).toBe("checkmate");
  });
});
