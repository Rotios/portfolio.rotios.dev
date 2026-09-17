"use client";

import type { Color, GameStatus } from "@/components/chess/engine";

import { Chip } from "@heroui/chip";

interface StatusBarProps {
  turn: Color;
  status: GameStatus;
  playerColor: Color;
  isAiThinking: boolean;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function StatusBar({
  turn,
  status,
  playerColor,
  isAiThinking,
}: StatusBarProps) {
  let label: string;
  let color: "default" | "success" | "danger" | "warning" | "primary" =
    "default";

  if (status === "checkmate") {
    const winner = turn === "white" ? "Black" : "White";
    const playerWon = winner.toLowerCase() === playerColor;

    label = `Checkmate — ${winner} wins`;
    color = playerWon ? "success" : "danger";
  } else if (status === "stalemate") {
    label = "Stalemate — draw";
    color = "warning";
  } else if (status === "draw") {
    label = "Draw";
    color = "warning";
  } else if (isAiThinking) {
    label = `${capitalize(turn)} (AI) is thinking…`;
    color = "primary";
  } else if (status === "check") {
    label = `${capitalize(turn)} to move — check!`;
    color = "danger";
  } else {
    label = `${capitalize(turn)} to move`;
    color = turn === playerColor ? "primary" : "default";
  }

  return (
    <Chip color={color} size="lg" variant="flat">
      {label}
    </Chip>
  );
}
