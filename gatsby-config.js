module.exports = {
  siteMetadata: {
    title: `Xceno.io`,
    siteUrl: "https://www.xceno.io",
    description: "Adventures in software and how to survive them.",
    language: "en"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-"
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }

            allSitePage(filter: {path: {glob: "/**?[!scripts]**" }}) {
              edges {
                node {
                  path
                }
              }
            }
        }`
      }
    }
  ]
};
