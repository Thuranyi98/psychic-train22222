import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import posts from "../data/articles.json";
import { Decoder, Footer, Icon } from "../components/ui";
import "../pages.css";

export const metadata: Metadata = { title: "Thura Nyi | Articles", description: "Articles on programming, design, and technology." };

function dateLabel(date: string) {
  if (!date) return "React / State management";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit", timeZone: "UTC" });
}

function PostCard({ post, featured = false }: { post: typeof posts[number]; featured?: boolean }) {
  return <article className={`post-card ${featured ? "featured-post" : ""}`}>
    {featured && <><span className="featured-label">Featured</span><span className="featured-number" aria-hidden="true">01</span></>}
    <Link href={`/articles/${post.slug}`} className="post-card-link">
      {featured && <div className="featured-image"><Image src={post.frontmatter.banner} alt="" fill sizes="(max-width: 1190px) 100vw, 55vw" priority /></div>}
      <div className="post-card-details">
        <div className="post-date"><span className="divider" /><time dateTime={post.frontmatter.date}>{dateLabel(post.frontmatter.date)}</time></div>
        <h2>{post.frontmatter.title}</h2>
        <p>{post.frontmatter.abstract}</p>
        <div className="post-card-footer"><span className="read-article"><Icon name="chevron-right" />Read article</span><span className="timecode">{post.timecode}</span></div>
      </div>
    </Link>
  </article>;
}

export default function ArticlesPage() {
  const featured = posts[0];
  return <div className="articles-page section">
    <div className="articles-grid">
      <div>
        <header className="articles-header"><h1><Decoder text="Latest articles" /></h1><span className="barcode" aria-hidden="true" /></header>
        {posts.filter(post => post !== featured).map(post => <PostCard post={post} key={post.slug} />)}
        <p className="blog-introduction">Practical insights for developers, from building web applications to preparing for technical interviews.</p>
        <a className="message-link" href="https://cultural-workshops-163557.framer.app/blog" target="_blank" rel="noopener noreferrer">Visit my original blog &rarr;</a>
      </div>
      <PostCard post={featured} featured />
    </div>
    <Footer />
  </div>;
}
