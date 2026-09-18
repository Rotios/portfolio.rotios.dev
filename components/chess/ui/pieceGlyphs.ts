import type { Color, Piece, PieceType } from "@/components/chess/engine";

const GLYPHS: Record<Color, Record<PieceType, string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

export function pieceGlyph(piece: Piece): string {
  return GLYPHS[piece.color][piece.type];
}

export function pieceLabel(piece: Piece): string {
  return `${piece.color} ${piece.type}`;
}
