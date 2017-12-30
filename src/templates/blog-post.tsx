import Link from "gatsby-link";
import * as React from "react";
import { shortDate, shortDateStylized } from "../utils/shortDate";

interface MarkdownPost {
  markdownRemark: {
    html: any;
    frontmatter: {
      title: string;
      date: string;
      next: string;
      previous: string;
    };
  };
}

export default ({ data }: { data: MarkdownPost }) => {
  const post = data.markdownRemark;
  return (
    <main className="article-open_item">
      <article className="blog-post-wrapper">
        <header className="post-header">
          <h1>{post.frontmatter.title}</h1>
          <span className="post-date">{shortDateStylized(new Date(post.frontmatter.date))}</span>
        </header>

        <section className="article-text post" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        next
        previous
      }
    }
  }
`;