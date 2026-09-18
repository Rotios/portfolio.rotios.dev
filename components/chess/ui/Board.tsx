"use client";

import type {
  Board as BoardState,
  Color,
  Move,
  Square as SquareName,
} from "@/components/chess/engine";

import Square from "./Square";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

interface BoardProps {
  board: BoardState;
  orientation: Color;
  selectedSquare: SquareName | null;
  legalTargets: SquareName[];
  lastMove: Move | null;
  checkedSquare: SquareName | null;
  disabled: boolean;
  onSquareClick: (square: SquareName) => void;
}

export default function Board({
  board,
  orientation,
  selectedSquare,
  legalTargets,
  lastMove,
  checkedSquare,
  disabled,
  onSquareClick,
}: BoardProps) {
  const files = orientation === "white" ? FILES : [...FILES].reverse();
  const ranks = orientation === "white" ? [...RANKS].reverse() : RANKS;

  return (
    <div className="mx-auto grid w-full max-w-[520px] grid-cols-8 overflow-hidden rounded-md border-2 border-default-800 shadow-lg">
      {ranks.map((rank) =>
        files.map((file) => {
          const square = `${file}${rank}` as SquareName;
          const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 1;

          return (
            <Square
              key={square}
              disabled={disabled}
              isInCheck={checkedSquare === square}
              isLastMove={lastMove?.from === square || lastMove?.to === square}
              isLegalTarget={legalTargets.includes(square)}
              isLight={isLight}
              isSelected={selectedSquare === square}
              piece={board[square]}
              square={square}
              onClick={onSquareClick}
            />
          );
        }),
      )}
    </div>
  );
}
