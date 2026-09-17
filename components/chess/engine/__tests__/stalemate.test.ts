import { describe, expect, it } from "vitest";

import { computeStatus, hasAnyLegalMove, isInCheck } from "../legal";

import { buildState } from "./helpers";

describe("stalemate detection", () => {
  it("recognizes the classic king+queen-vs-king stalemate", () => {
    const state = buildState({
      h1: { type: "king", color: "white" },
      f2: { type: "king", color: "black" },
      g3: { type: "queen", color: "black" },
    });

    expect(isInCheck(state, "white")).toBe(false);
    expect(hasAnyLegalMove(state, "white")).toBe(false);
    expect(computeStatus(state)).toBe("stalemate");
  });

  it("is not stalemate when the side to move has any legal move", () => {
    const state = buildState({
      h1: { type: "king", color: "white" },
      f2: { type: "king", color: "black" },
      g4: { type: "queen", color: "black" },
    });

    expect(computeStatus(state)).toBe("active");
  });
});
