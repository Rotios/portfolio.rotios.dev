"use client";

import type { Difficulty } from "@/components/chess/ai";
import type { Color } from "@/components/chess/engine";

import { Button } from "@heroui/button";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const COLORS: Color[] = ["white", "black"];

interface GameControlsProps {
  difficulty: Difficulty;
  playerColor: Color;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onPlayerColorChange: (color: Color) => void;
  onNewGame: () => void;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function GameControls({
  difficulty,
  playerColor,
  onDifficultyChange,
  onPlayerColorChange,
  onNewGame,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-default-500">Play as</span>
        <div className="flex gap-1">
          {COLORS.map((color) => (
            <Button
              key={color}
              color={playerColor === color ? "primary" : "default"}
              size="sm"
              variant={playerColor === color ? "solid" : "flat"}
              onPress={() => onPlayerColorChange(color)}
            >
              {capitalize(color)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-default-500">Difficulty</span>
        <div className="flex gap-1">
          {DIFFICULTIES.map((level) => (
            <Button
              key={level}
              color={difficulty === level ? "primary" : "default"}
              size="sm"
              variant={difficulty === level ? "solid" : "flat"}
              onPress={() => onDifficultyChange(level)}
            >
              {capitalize(level)}
            </Button>
          ))}
        </div>
      </div>

      <Button color="danger" size="sm" variant="flat" onPress={onNewGame}>
        New Game
      </Button>
    </div>
  );
}
