import { title } from "@/components/primitives";
import Minesweeper from '@/components/minesweeper/Minesweeper'

export default function ProjectsPage() {
  return (
    <div>
      <div>
        <h1 className={title()}>Minesweeper</h1>
      </div>
      <div >
        <p >A project from a previous react website ported over to NextUI.</p>
      </div>

      <div >
        <Minesweeper></Minesweeper>
      </div>

    </div>
  );
}
