import { title } from "@/components/primitives";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className={title()}>Projects</h1>

      <h2>Minesweeper</h2>
      <p>One of the first projects I worked on was a Minesweeper React components which had the ability to solve itself. You can play with it here: <Link href="/projects/minesweeper">Minesweeper.</Link></p>
    </div>
  );
}
