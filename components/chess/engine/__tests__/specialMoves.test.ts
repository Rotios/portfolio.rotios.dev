import { describe, expect, it } from "vitest";

import { applyMove, createInitialGameState, getLegalMoves } from "../index";

import { buildState } from "./helpers";

describe("castling", () => {
  function castlingState() {
    return buildState(
      {
        e1: { type: "king", color: "white" },
        a1: { type: "rook", color: "white" },
        h1: { type: "rook", color: "white" },
        e8: { type: "king", color: "black" },
      },
      {
        castlingRights: {
          whiteKingSide: true,
          whiteQueenSide: true,
          blackKingSide: false,
          blackQueenSide: false,
        },
      },
    );
  }

  it("offers both castling destinations when squares are empty and safe", () => {
    const state = castlingState();
    const destinations = getLegalMoves(state, "e1")
      .map((m) => m.to)
      .sort();

    expect(destinations).toEqual(expect.arrayContaining(["c1", "g1"]));
  });

  it("moves the rook to f1 and revokes rights on kingside castling", () => {
    const state = castlingState();
    const result = applyMove(state, { from: "e1", to: "g1" });

    expect(result.error).toBeUndefined();
    expect(result.state.board.g1).toEqual({ type: "king", color: "white" });
    expect(result.state.board.f1).toEqual({ type: "rook", color: "white" });
    expect(result.state.board.e1).toBeNull();
    expect(result.state.board.h1).toBeNull();
    expect(result.state.castlingRights.whiteKingSide).toBe(false);
    expect(result.state.castlingRights.whiteQueenSide).toBe(false);
  });

  it("moves the rook to d1 on queenside castling", () => {
    const state = castlingState();
    const result = applyMove(state, { from: "e1", to: "c1" });

    expect(result.error).toBeUndefined();
    expect(result.state.board.c1).toEqual({ type: "king", color: "white" });
    expect(result.state.board.d1).toEqual({ type: "rook", color: "white" });
    expect(result.state.board.a1).toBeNull();
  });

  it("forbids castling through an attacked square", () => {
    const state = buildState(
      {
        e1: { type: "king", color: "white" },
        a1: { type: "rook", color: "white" },
        h1: { type: "rook", color: "white" },
        e8: { type: "king", color: "black" },
        f8: { type: "rook", color: "black" },
      },
      {
        castlingRights: {
          whiteKingSide: true,
          whiteQueenSide: true,
          blackKingSide: false,
          blackQueenSide: false,
        },
      },
    );
    const destinations = getLegalMoves(state, "e1").map((m) => m.to);

    expect(destinations).not.toContain("g1");
    expect(destinations).toContain("c1");
  });

  it("forbids castling while in check", () => {
    const state = buildState(
      {
        e1: { type: "king", color: "white" },
        a1: { type: "rook", color: "white" },
        h1: { type: "rook", color: "white" },
        e8: { type: "king", color: "black" },
        e5: { type: "rook", color: "black" },
      },
      {
        castlingRights: {
          whiteKingSide: true,
          whiteQueenSide: true,
          blackKingSide: false,
          blackQueenSide: false,
        },
      },
    );
    const destinations = getLegalMoves(state, "e1").map((m) => m.to);

    expect(destinations).not.toContain("g1");
    expect(destinations).not.toContain("c1");
  });
});

describe("en passant", () => {
  it("allows capturing a pawn that just double-moved beside it", () => {
    let result = applyMove(createInitialGameState(), { from: "e2", to: "e4" });

    result = applyMove(result.state, { from: "a7", to: "a6" });
    result = applyMove(result.state, { from: "e4", to: "e5" });
    result = applyMove(result.state, { from: "d7", to: "d5" });

    expect(result.state.enPassantTarget).toBe("d6");

    const epMoves = getLegalMoves(result.state, "e5").map((m) => m.to);

    expect(epMoves).toContain("d6");

    result = applyMove(result.state, { from: "e5", to: "d6" });
    expect(result.error).toBeUndefined();
    expect(result.state.board.d6).toEqual({ type: "pawn", color: "white" });
    expect(result.state.board.d5).toBeNull();
    expect(result.state.board.e5).toBeNull();
  });
});

describe("promotion", () => {
  function promotionState() {
    return buildState({
      a7: { type: "pawn", color: "white" },
      e1: { type: "king", color: "white" },
      e8: { type: "king", color: "black" },
    });
  }

  it("offers all four promotion choices as legal moves", () => {
    const state = promotionState();
    const moves = getLegalMoves(state, "a7").filter((m) => m.to === "a8");
    const promotions = moves.map((m) => m.promotion).sort();

    expect(promotions).toEqual(["bishop", "knight", "queen", "rook"]);
  });

  it("promotes to the requested piece type", () => {
    const state = promotionState();
    const result = applyMove(state, {
      from: "a7",
      to: "a8",
      promotion: "queen",
    });

    expect(result.error).toBeUndefined();
    expect(result.state.board.a8).toEqual({ type: "queen", color: "white" });
    expect(result.state.board.a7).toBeNull();
  });

  it("rejects a promotion move with no promotion piece specified", () => {
    const state = promotionState();
    const result = applyMove(state, { from: "a7", to: "a8" });

    expect(result.error).toBeDefined();
    expect(result.state).toBe(state);
  });
});
