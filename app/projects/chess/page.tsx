import { title } from "@/components/primitives";
import ChessGame from "@/components/chess/ui/ChessGame";

export default function ChessPage() {
  return (
    <div>
      <div>
        <h1 className={title()}>Chess</h1>
      </div>
      <div>
        <div className="py-4 text-left">
          <p>
            Play chess against an AI opponent, right in the browser. Choose your
            side and a difficulty level, then click a piece to see its legal
            moves and click a highlighted square to move. Castling, en passant,
            and pawn promotion are all supported.
          </p>
        </div>
      </div>
      <div className="py-4">
        <ChessGame />
      </div>
    </div>
  );
}
