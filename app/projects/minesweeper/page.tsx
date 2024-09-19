import { title } from "@/components/primitives";
import Minesweeper from '@/components/minesweeper/Minesweeper'

export default function ProjectsPage() {
  return (
    <div>
      <div>
        <h1 className={title()}>Minesweeper</h1>
      </div>
      <div>
      <div className="py-4 text-left">

        <p >A project from a previous react website ported over to NextUI.
            This minesweeper project includes buttons to help you solve the minesweeper puzzle.
            The layout is 10x10 and includes 12 mines. Can you find them all?
        </p>
        </div>
      </div>
      <div className="py-4">
        <Minesweeper></Minesweeper>
      </div>
    </div>
  );
}
