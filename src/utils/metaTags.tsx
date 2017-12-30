import React from "react";

import getPreFoldContent from "./getPreFoldContent";
// import extractImage from "./extractImage";

const tag = (name: string, value: string) => <meta key={name} property={name} content={value} />;

const removeHTML = (html: string) => html.replace(/<[^>]*>/g, "");

const generatePageSpecificTags = (page: any, config: any, url: string) => {
  if (!page || !page.data || !page.data.body) {
    return [];
  }
  const data = page.data;
  const date = data.date.toJSON ? data.date.toJSON() : data.date;

  const blurb = removeHTML(config.authorBlurb);
  // const pageImage = extractImage(data.body);
  const preFold = getPreFoldContent(data.body);
  const description = removeHTML(preFold);
  const twitterCardType = /*pageImage ? "summary_large_image" : */ "summary";
  const socialImage = /*pageImage ||*/ config.authorImage;

  const ld = {
    "@context": "http://schema.org",
    "@type": "Article",
    publisher: {
      "@type": "Organization",
      name: config.blogTitle,
      logo: config.authorImage
    },
    author: {
      "@type": "Person",
      name: config.authorName,
      image: config.authorImage,
      url: config.authorURL,
      description: blurb
    },
    headline: data.title,
    datePublished: date,
    url,
    description,
    image: {
      "@type": "ImageObject",
      url: socialImage
    },
    mainEntityOfPage: url
  };

  return [
    tag("og:image", socialImage),
    tag("twitter:image", socialImage),

    tag("og:type", "article"),
    tag("og:title", data.title),
    tag("og:description", description),
    tag("article:published_time", date),

    tag("twitter:card", twitterCardType),
    tag("twitter:title", data.title),
    tag("twitter:description", description),

    <script key="ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld, null, "  ") }} />
  ];
};
export default function generateMetaTags(page: any, config: any, path: string) {
  const url = config.domain + path;

  const tags = [
    tag("generator", "https://github.com/gatsbyjs/gatsby"),
    <link key="canonical" rel="canonical" href={url} />,
    <link key="alternate" rel="alternate" type="application/rss+xml" title={config.blogTitle} href={`${config.domain}/rss.xml`} />,
    tag("og:site_name", config.blogTitle),
    tag("og:url", url),
    tag("twitter:url", url)
    // tag("twitter:site", config.authorTwitter)
  ];

  const pageSpecific = generatePageSpecificTags(page, config, url);

  return tags.concat(pageSpecific);
}
