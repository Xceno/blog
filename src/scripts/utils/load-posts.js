import fs from "fs";
import path from "path";

import frontMatter from "front-matter";
// // import markdownIt from "markdown-it";

// // const md = markdownIt({
// //   html: true,
// //   linkify: true,
// //   typographer: false
// // });
const fileFilter = /.md$/;

export default function loadPosts(providedOptions) {
  const options = providedOptions || {};

  const limit = options.limit || Infinity;
  // // const markdown = typeof options.markdown === "undefined" ? true : options.markdown;

  const postsPath = path.join(__dirname, "../../pages/posts");
  const postFiles = fs.readdirSync(postsPath);

  return (postFiles || [])
    .filter(file => fileFilter.test(file))
    .sort((a, b) => a.localeCompare(b))
    .reverse()
    .slice(limit * -1)
    .map(file => {
      const filePath = path.join(postsPath, file);
      const contents = fs.readFileSync(filePath).toString();
      const metadata = frontMatter(contents);

      return {
        path: filePath,
        contents,
        body: null,
        data: metadata.attributes
      };
    });
}
