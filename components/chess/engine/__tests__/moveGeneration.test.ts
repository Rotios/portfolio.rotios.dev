import { describe, expect, it } from "vitest";

import { createInitialGameState, getLegalMoves } from "../index";
import { ALL_SQUARES } from "../board";

describe("createInitialGameState", () => {
  it("sets up the standard starting position", () => {
    const state = createInitialGameState();

    expect(state.turn).toBe("white");
    expect(state.status).toBe("active");
    expect(state.castlingRights).toEqual({
      whiteKingSide: true,
      whiteQueenSide: true,
      blackKingSide: true,
      blackQueenSide: true,
    });
    expect(state.enPassantTarget).toBeNull();
    expect(state.halfmoveClock).toBe(0);
    expect(state.fullmoveNumber).toBe(1);
    expect(state.moveHistory).toEqual([]);

    const pieceCount = ALL_SQUARES.filter(
      (sq) => state.board[sq] !== null,
    ).length;

    expect(pieceCount).toBe(32);
    expect(state.board.e1).toEqual({ type: "king", color: "white" });
    expect(state.board.e8).toEqual({ type: "king", color: "black" });
    expect(state.board.a1).toEqual({ type: "rook", color: "white" });
    expect(state.board.d8).toEqual({ type: "queen", color: "black" });
  });
});

describe("getLegalMoves", () => {
  it("gives pawns two starting-square options", () => {
    const state = createInitialGameState();
    const moves = getLegalMoves(state, "e2");
    const destinations = moves.map((m) => m.to).sort();

    expect(destinations).toEqual(["e3", "e4"]);
  });

  it("gives knights their two opening jumps", () => {
    const state = createInitialGameState();
    const moves = getLegalMoves(state, "b1");
    const destinations = moves.map((m) => m.to).sort();

    expect(destinations).toEqual(["a3", "c3"]);
  });

  it("returns no moves for an empty square", () => {
    const state = createInitialGameState();

    expect(getLegalMoves(state, "e4")).toEqual([]);
  });

  it("returns no moves for a piece when it isn't that color's turn", () => {
    const state = createInitialGameState();

    expect(getLegalMoves(state, "e7")).toEqual([]);
  });

  it("white has exactly 20 legal moves in the starting position", () => {
    const state = createInitialGameState();
    const total = ALL_SQUARES.reduce(
      (sum, sq) => sum + getLegalMoves(state, sq).length,
      0,
    );

    expect(total).toBe(20);
  });
});
