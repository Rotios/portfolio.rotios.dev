import { describe, expect, it } from "vitest";

import { pieceGlyph, pieceLabel } from "./pieceGlyphs";

describe("pieceGlyphs", () => {
  it("maps every piece type and color to a distinct glyph", () => {
    const glyphs = new Set<string>();

    for (const color of ["white", "black"] as const) {
      for (const type of [
        "king",
        "queen",
        "rook",
        "bishop",
        "knight",
        "pawn",
      ] as const) {
        const glyph = pieceGlyph({ type, color });

        expect(glyph).toBeTruthy();
        glyphs.add(glyph);
      }
    }
    expect(glyphs.size).toBe(12);
  });

  it("labels a piece with its color and type", () => {
    expect(pieceLabel({ type: "knight", color: "white" })).toBe("white knight");
  });
});
