"use client";

import type { Piece, Square as SquareName } from "@/components/chess/engine";

import { pieceGlyph, pieceLabel } from "./pieceGlyphs";

interface SquareProps {
  square: SquareName;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  disabled: boolean;
  onClick: (square: SquareName) => void;
}

export default function Square({
  square,
  piece,
  isLight,
  isSelected,
  isLegalTarget,
  isLastMove,
  isInCheck,
  disabled,
  onClick,
}: SquareProps) {
  const base = isLight ? "bg-amber-100" : "bg-amber-700";
  const overlay = isSelected
    ? "ring-4 ring-inset ring-blue-500"
    : isInCheck
      ? "ring-4 ring-inset ring-red-500"
      : isLastMove
        ? "ring-4 ring-inset ring-yellow-400"
        : "";

  return (
    <button
      aria-label={piece ? `${square} ${pieceLabel(piece)}` : square}
      className={`relative flex aspect-square w-full items-center justify-center select-none text-3xl sm:text-4xl transition-colors ${base} ${overlay} disabled:cursor-default`}
      disabled={disabled}
      type="button"
      onClick={() => onClick(square)}
    >
      {piece && (
        <span
          className={
            piece.color === "white"
              ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              : "text-black"
          }
        >
          {pieceGlyph(piece)}
        </span>
      )}
      {isLegalTarget && !piece && (
        <span className="absolute h-1/4 w-1/4 rounded-full bg-black/30" />
      )}
      {isLegalTarget && piece && (
        <span className="absolute inset-0 rounded-sm ring-4 ring-inset ring-black/40" />
      )}
    </button>
  );
}
