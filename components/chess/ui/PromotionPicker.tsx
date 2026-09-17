"use client";

import type { Color, PieceType } from "@/components/chess/engine";

import { Button } from "@heroui/button";

import { pieceGlyph } from "./pieceGlyphs";

const CHOICES: PieceType[] = ["queen", "rook", "bishop", "knight"];

interface PromotionPickerProps {
  color: Color;
  onChoose: (type: PieceType) => void;
  onCancel: () => void;
}

export default function PromotionPicker({
  color,
  onChoose,
  onCancel,
}: PromotionPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Cancel promotion"
        className="absolute inset-0 bg-black/50"
        type="button"
        onClick={onCancel}
      />
      <div className="relative flex flex-col items-center gap-3 rounded-lg bg-content1 p-6 shadow-xl">
        <p className="text-sm text-default-600">Promote pawn to:</p>
        <div className="flex gap-2">
          {CHOICES.map((type) => (
            <Button
              key={type}
              isIconOnly
              aria-label={`Promote to ${type}`}
              className="text-3xl"
              size="lg"
              variant="flat"
              onPress={() => onChoose(type)}
            >
              {pieceGlyph({ type, color })}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
