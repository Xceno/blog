import { graphql } from "gatsby";
import * as React from "react";
import { Layout } from "../components/layout";
import { shortDateStylized } from "../utils/shortDate";

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

export default ({ data: { markdownRemark: post } }: { data: MarkdownPost }) => (
  <Layout>
    <main className="article-open_item">
      <article className="blog-post-wrapper">
        <header className="post-header">
          <h1>{post.frontmatter.title}</h1>
          <span className="post-date">{shortDateStylized(new Date(post.frontmatter.date))}</span>
        </header>

        <section className="article-text post" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  </Layout>
);
