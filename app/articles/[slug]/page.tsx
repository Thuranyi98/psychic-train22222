import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "../../data/articles.json";
import ArticleBody from "../../components/article-body";
import { Footer } from "../../components/ui";
import "../../pages.css";

export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(item => item.slug === slug);
  return { title: post ? `${post.frontmatter.title} | Thura Nyi` : "Article not found", description: post?.frontmatter.abstract };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const post = posts.find(item => item.slug === slug);
  if (!post) notFound();
  const date = post.frontmatter.date ? new Date(`${post.frontmatter.date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit", timeZone: "UTC" }) : "React / State management";
  return <article className="article-page">
    <div className="article-banner"><Image src={post.frontmatter.banner} alt="" fill sizes="100vw" priority /></div>
    <div className="section">
      <header className="article-header">
        <div className="post-date"><span className="divider" /><time dateTime={post.frontmatter.date}>{date}</time></div>
        <h1>{post.frontmatter.title}</h1>
        <div className="article-details"><a href="#postContent" aria-label="Scroll to post content"><svg width="43" height="15" viewBox="0 0 43 15" aria-hidden="true"><path d="m1 1 20.5 12L42 1" stroke="currentColor" strokeWidth="2" fill="none" /></svg></a><span className="timecode">{post.timecode}</span></div>
      </header>
      <ArticleBody html={post.html} />
      <div className="article-back"><Link href="/articles">&larr; All articles</Link></div>
    </div>
    <Footer />
  </article>;
}
