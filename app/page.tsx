import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title({size: "lg"})}>Jose Rivas-Garcia&nbsp;</h1>
        <br/>
        <h1 className={title({size: "sm"})}>A.K.A.&nbsp;</h1>
        <h1 className={title({ color: "yellow" })}>Rotios&nbsp;</h1>

        <h2 className={subtitle({ class: "mt-4" })}>
           Senior Software Engineer
        </h2>
      </div>
      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.linkedIn}
        >
          <i className="fab fa-linkedin" />
          LinkedIn
        </Link>

        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
        <i className="fab fa-github" />
          GitHub
        </Link>
      </div>

      <div className="flex gap-3">

      <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.resume}
        >
        <i className="fa fa-file"></i>
          Resume
        </Link>
      </div>


      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Check out my personal <Code color="primary"><Link color="foreground" isExternal href="/projects">projects</Link></Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
