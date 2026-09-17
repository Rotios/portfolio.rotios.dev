"use client";

import type { Board, Color, PieceType } from "@/components/chess/engine";

import { pieceGlyph } from "./pieceGlyphs";

const INITIAL_COUNTS: Record<PieceType, number> = {
  pawn: 8,
  knight: 2,
  bishop: 2,
  rook: 2,
  queen: 1,
  king: 1,
};

const DISPLAY_ORDER: PieceType[] = [
  "queen",
  "rook",
  "bishop",
  "knight",
  "pawn",
];

function capturedFor(board: Board, color: Color): PieceType[] {
  const remaining: Record<PieceType, number> = {
    pawn: 0,
    knight: 0,
    bishop: 0,
    rook: 0,
    queen: 0,
    king: 0,
  };

  for (const square of Object.keys(board) as (keyof Board)[]) {
    const piece = board[square];

    if (piece && piece.color === color) remaining[piece.type] += 1;
  }
  const captured: PieceType[] = [];

  for (const type of DISPLAY_ORDER) {
    const missing = INITIAL_COUNTS[type] - remaining[type];

    for (let i = 0; i < missing; i += 1) captured.push(type);
  }

  return captured;
}

interface CapturedPiecesProps {
  board: Board;
  color: Color;
}

export default function CapturedPieces({ board, color }: CapturedPiecesProps) {
  const captured = capturedFor(board, color);

  return (
    <div className="flex min-h-[1.75rem] flex-wrap items-center gap-1 text-xl text-default-500">
      {captured.length === 0 ? (
        <span className="text-sm text-default-400">No captures</span>
      ) : (
        captured.map((type, i) => (
          <span key={`${type}-${i}`}>{pieceGlyph({ type, color })}</span>
        ))
      )}
    </div>
  );
}
