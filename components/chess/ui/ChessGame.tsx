"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Board from "./Board";
import StatusBar from "./StatusBar";
import GameControls from "./GameControls";
import CapturedPieces from "./CapturedPieces";
import PromotionPicker from "./PromotionPicker";

import { chooseMove, type Difficulty } from "@/components/chess/ai";
import {
  applyMove,
  createInitialGameState,
  getLegalMoves,
  type Color,
  type GameState,
  type Move,
  type PieceType,
  type Square as SquareName,
} from "@/components/chess/engine";

function opponentOf(color: Color): Color {
  return color === "white" ? "black" : "white";
}

function findKingSquare(state: GameState, color: Color): SquareName | null {
  for (const square of Object.keys(state.board) as SquareName[]) {
    const piece = state.board[square];

    if (piece && piece.type === "king" && piece.color === color) return square;
  }

  return null;
}

export default function ChessGame() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(),
  );
  const [playerColor, setPlayerColor] = useState<Color>("white");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedSquare, setSelectedSquare] = useState<SquareName | null>(null);
  const [legalTargets, setLegalTargets] = useState<SquareName[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: SquareName;
    to: SquareName;
  } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  const gameOver =
    gameState.status === "checkmate" ||
    gameState.status === "stalemate" ||
    gameState.status === "draw";
  const lastMove =
    gameState.moveHistory[gameState.moveHistory.length - 1] ?? null;
  const checkedSquare = useMemo(
    () =>
      gameState.status === "check" || gameState.status === "checkmate"
        ? findKingSquare(gameState, gameState.turn)
        : null,
    [gameState],
  );

  const startNewGame = useCallback((color: Color) => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    setMoveError(null);
    setPlayerColor(color);
  }, []);

  // Let the AI move whenever it's not the human player's turn.
  useEffect(() => {
    if (gameOver || pendingPromotion || gameState.turn === playerColor) return;

    let cancelled = false;

    setIsAiThinking(true);

    chooseMove(gameState, difficulty)
      .then((move) => {
        if (cancelled) return;
        setGameState((prev) => applyMove(prev, move).state);
      })
      .catch((err) => {
        if (!cancelled)
          setMoveError(
            err instanceof Error ? err.message : "AI failed to move",
          );
      })
      .finally(() => {
        if (!cancelled) setIsAiThinking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gameState, playerColor, difficulty, gameOver, pendingPromotion]);

  const commitMove = useCallback(
    (move: Move) => {
      const result = applyMove(gameState, move);

      if (result.error) {
        setMoveError(result.error);

        return;
      }
      setGameState(result.state);
      setSelectedSquare(null);
      setLegalTargets([]);
    },
    [gameState],
  );

  const selectSquare = useCallback(
    (square: SquareName) => {
      const moves = getLegalMoves(gameState, square);

      if (moves.length === 0) {
        setSelectedSquare(null);
        setLegalTargets([]);

        return;
      }
      setSelectedSquare(square);
      setLegalTargets(Array.from(new Set(moves.map((m) => m.to))));
    },
    [gameState],
  );

  const handleSquareClick = useCallback(
    (square: SquareName) => {
      if (
        gameOver ||
        isAiThinking ||
        pendingPromotion ||
        gameState.turn !== playerColor
      )
        return;
      setMoveError(null);

      const piece = gameState.board[square];

      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setLegalTargets([]);

          return;
        }

        if (legalTargets.includes(square)) {
          const candidates = getLegalMoves(gameState, selectedSquare).filter(
            (m) => m.to === square,
          );
          const needsPromotionChoice = candidates.some((m) => m.promotion);

          if (needsPromotionChoice) {
            setPendingPromotion({ from: selectedSquare, to: square });

            return;
          }
          commitMove({ from: selectedSquare, to: square });

          return;
        }

        if (piece && piece.color === playerColor) {
          selectSquare(square);

          return;
        }

        setSelectedSquare(null);
        setLegalTargets([]);

        return;
      }

      if (piece && piece.color === playerColor) {
        selectSquare(square);
      }
    },
    [
      gameOver,
      isAiThinking,
      pendingPromotion,
      gameState,
      playerColor,
      selectedSquare,
      legalTargets,
      commitMove,
      selectSquare,
    ],
  );

  const handlePromotionChoose = useCallback(
    (type: PieceType) => {
      if (!pendingPromotion) return;
      commitMove({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: type,
      });
      setPendingPromotion(null);
    },
    [pendingPromotion, commitMove],
  );

  const handlePromotionCancel = useCallback(() => {
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalTargets([]);
  }, []);

  const opponentColor = opponentOf(playerColor);
  const boardDisabled =
    gameOver ||
    isAiThinking ||
    !!pendingPromotion ||
    gameState.turn !== playerColor;

  return (
    <div className="flex flex-col items-center gap-4">
      <GameControls
        difficulty={difficulty}
        playerColor={playerColor}
        onDifficultyChange={setDifficulty}
        onNewGame={() => startNewGame(playerColor)}
        onPlayerColorChange={startNewGame}
      />

      <StatusBar
        isAiThinking={isAiThinking}
        playerColor={playerColor}
        status={gameState.status}
        turn={gameState.turn}
      />

      <div className="flex w-full max-w-[520px] items-center justify-between">
        <div>
          <p className="mb-1 text-xs text-default-500">Captured by you</p>
          <CapturedPieces board={gameState.board} color={opponentColor} />
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs text-default-500">Captured by opponent</p>
          <CapturedPieces board={gameState.board} color={playerColor} />
        </div>
      </div>

      <Board
        board={gameState.board}
        checkedSquare={checkedSquare}
        disabled={boardDisabled}
        lastMove={lastMove}
        legalTargets={legalTargets}
        orientation={playerColor}
        selectedSquare={selectedSquare}
        onSquareClick={handleSquareClick}
      />

      {moveError && <p className="text-sm text-danger">{moveError}</p>}

      {pendingPromotion && (
        <PromotionPicker
          color={playerColor}
          onCancel={handlePromotionCancel}
          onChoose={handlePromotionChoose}
        />
      )}
    </div>
  );
}
