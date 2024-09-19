import { title } from "@/components/primitives";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import {Divider} from "@nextui-org/divider";
import {Link} from "@nextui-org/link";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Projects</h1>
      </div>

      <div className="flex gap-3">

        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Link color="foreground" href="/projects/minesweeper">
            <Image
              alt="Minesweeper Solver"
              height={50}
              radius="md"
              src="/minesweeper_detector.jpeg"
              width={50}
            />
              <div className="flex flex-col text-left">
                <p className="text-md">Minesweeper</p>
                <p className="text-small text-default-500">Game and Solver. Try it out!</p>
              </div>
            </Link>
          </CardHeader>
          <Divider/>
          <CardBody className="text-left">
          <p>A project from a previous react website ported over to NextUI.</p>
          <br/>
          <p>
                This minesweeper project includes buttons to help you solve the minesweeper puzzle.
                The layout is 10x10 and includes 12 mines. Can you find them all?
            </p>
          </CardBody>
          <Divider/>
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href="/projects/minesweeper"
            >
              See it in action!
            </Link>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
