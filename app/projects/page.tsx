import { title } from "@/components/primitives";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import {Divider} from "@nextui-org/divider";
import {Link} from "@nextui-org/link";
import { projectsConfig } from "@/config/projects";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Projects</h1>
      </div>

      <div className="flex gap-3 flex-col">
      <ul className="flex flex-col gap-4 justify-start ml-2">
      {projectsConfig.map(project=> {
        return (
        <Card key={project.name} className="max-w-[500px]">
          <CardHeader className="flex gap-3">
            <Link color="foreground" href={project.href}>
            <Image
              alt={project.name}
              height={50}
              radius="md"
              src={project.imageSrc}
              width={50}
            />
              <div className="flex flex-col text-left" style={{marginLeft: "5px"}}>
                <p className="text-md">{project.name}</p>
                <p className="text-small text-default-500">{project.summary}</p>
              </div>
            </Link>
          </CardHeader>
          <Divider/>
          <CardBody className="text-left">
            {project.description}
          </CardBody>
          <Divider/>
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href={project.href}
            >
              See it in action!
            </Link>
          </CardFooter>
        </Card>
      )})}
      </ul>
      </div>
    </div>
  );
}
