import { title } from "@/components/primitives";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Chip} from "@heroui/chip";
import {Divider} from "@heroui/divider";
import {Link} from "@heroui/link";
import { getSortedPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getSortedPosts();

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Blog</h1>
      </div>

      <div className="flex gap-3 flex-col">
      <ul className="flex flex-col gap-4 justify-start ml-2">
      {posts.map(post => {
        return (
        <Card key={post.slug} className="max-w-[500px]">
          <CardHeader className="flex gap-3">
            <Link color="foreground" href={`/blog/${post.slug}`}>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <p className="text-md">{post.title}</p>
                  {post.aiGenerated && (
                    <Chip color="secondary" size="sm" variant="flat">
                      Drafted by Claude
                    </Chip>
                  )}
                </div>
                <p className="text-small text-default-500">{post.summary}</p>
              </div>
            </Link>
          </CardHeader>
          <Divider/>
          <CardBody className="text-left">
            <p className="text-small text-default-500">{post.date}</p>
          </CardBody>
          <Divider/>
          <CardFooter>
            <Link
              showAnchorIcon
              href={`/blog/${post.slug}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      )})}
      </ul>
      </div>
    </div>
  );
}
