import { notFound } from "next/navigation";
import { title } from "@/components/primitives";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div>
        <h1 className={title()}>{post.title}</h1>
      </div>
      <div className="py-2 text-left">
        <p className="text-small text-default-500">{post.date}</p>
      </div>
      <div
        className="py-4 text-left prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}
