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

      <div className="flex gap-3 flex-col">

      <Card className="max-w-[500px]">
          <CardHeader className="flex gap-3">
            <Link color="foreground" href="https://game-stat-simulators.rotios.com/">
            <Image
              alt="Tribute Image"
              height={50}
              radius="md"
              src="/GSSLogo.jpeg"
              width={50}
            />
              <div className="flex flex-col text-left" style={{marginLeft: "5px"}}>
                <p className="text-md">Game Stat Simulators</p>
                <p className="text-small text-default-500">Lit JS website for caulcating stat increases.</p>
              </div>
            </Link>
          </CardHeader>
          <Divider/>
          <CardBody className="text-left">
            <p>
              This website will help you calculate how many games you need to play in order to increase your stats by
              any amount. It uses simple maths to calculate your expected average and also simulates matches until
              your stats are reached. The simulations are entirely based on the stats you provide as input.
            </p>
            <br/>
            <p>Game Stat Simulators was build using Lit JS and Vaadin components.</p>
          </CardBody>
          <Divider/>
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href="https://game-stat-simulators.rotios.com/"
            >
              See it in action!
            </Link>
          </CardFooter>
        </Card>
        <Card className="max-w-[500px]">
          <CardHeader className="flex gap-3">
            <Link color="foreground" href="/projects/minesweeper">
            <Image
              alt="Minesweeper Solver"
              height={50}
              radius="md"
              src="/minesweeper_detector.jpeg"
              width={50}
            />
              <div className="flex flex-col text-left" style={{marginLeft: "5px"}}>
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

        <Card className="max-w-[500px]">
          <CardHeader className="flex gap-3">
            <Link color="foreground" href="https://rotios.github.io/The-Adventures-of-Fat-Tone/">
            <Image
              alt="Tribute Image"
              height={50}
              radius="md"
              src="/TAOFT.jpeg"
              width={50}
            />
              <div className="flex flex-col text-left" style={{marginLeft: "5px"}}>
                <p className="text-md">The Adventures of Fat Tone</p>
                <p className="text-small text-default-500">Roguelike game using Rot.JS!</p>
              </div>
            </Link>
          </CardHeader>
          <Divider/>
          <CardBody className="text-left">
            <p>A short Roguelike game written with the Rot.JS library. In conjunction with <Link
                isExternal
                href="https://www.github.com/jcf1"
              >
                John Freeman.
              </Link>
            </p>

          </CardBody>
          <Divider/>
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href="https://rotios.github.io/The-Adventures-of-Fat-Tone/"
            >
              See it in action!
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
