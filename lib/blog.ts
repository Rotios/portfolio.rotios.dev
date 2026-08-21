import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPostSummary {
  slug: string;
  title: string;
  summary: string;
  date: string;
}

export interface BlogPost extends BlogPostSummary {
  contentHtml: string;
}

function readPostFile(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return matter(fileContents);
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getSortedPosts(): BlogPostSummary[] {
  const posts = getAllPostSlugs().map((slug) => {
    const { data } = readPostFile(slug);
    return {
      slug,
      title: data.title as string,
      summary: data.summary as string,
      date: data.date as string,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!getAllPostSlugs().includes(slug)) {
    return null;
  }

  const { data, content } = readPostFile(slug);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: data.title as string,
    summary: data.summary as string,
    date: data.date as string,
    contentHtml: processedContent.toString(),
  };
}
