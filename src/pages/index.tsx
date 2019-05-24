import { graphql, StaticQuery } from "gatsby";
import Link from "gatsby-link";
import * as React from "react";
import { Layout } from "../components/layout";
import { shortDate } from "../utils/shortDate";

interface BlogPost {
  id: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
  };
  fields: {
    slug: string;
  };
  excerpt: string;
  timeToRead: number;
}

interface BlogPostList {
  site: any;
  allMarkdownRemark: {
    totalCount: number;
    edges: [{ node: BlogPost }];
  };
}

const readMoreLink = (slug: string) => (
  // @ts-ignore
  <Link
    to={slug}
    style={{
      fontSize: "1.6em",
      lineHeight: "0.5em",
      textDecoration: "none",
      verticalAlign: "middle"
    }}
  >
    →
  </Link>
);

const query = graphql`
  query PostsQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/(posts)/.*\\.md$/" }, frontmatter: { draft: { eq: false } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            tags
          }
          fields {
            slug
          }
          excerpt(pruneLength: 300)
          timeToRead
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;

// tslint:disable-next-line:variable-name
const BlogPostIndex = () => (
  <StaticQuery
    query={query}
    // tslint:disable-next-line:jsx-no-lambda
    render={data => (
      <Layout>
        <div role="main" className="post_list">
          <header>
            <h1>{data.site.siteMetadata.title}</h1>
            <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
          </header>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <div className="article-closed_item" key={node.id}>
              <h2>
                {
                  // @ts-ignore
                  <Link to={node.fields.slug} style={{ textDecoration: `none`, color: `inherit` }}>
                    {node.frontmatter.title}
                  </Link>
                }
              </h2>
              <time style={{ color: "#888" }} dateTime={node.frontmatter.date}>
                {shortDate(new Date(node.frontmatter.date))}
              </time>
              <p className="article-excerpt">
                {node.excerpt} {readMoreLink(node.fields.slug)}
              </p>
              <div className="article-tags">
                {node.frontmatter.tags
                  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
                  .map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Layout>
    )}
  />
);

// tslint:disable-next-line:no-default-export
export default BlogPostIndex;
