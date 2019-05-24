import fs from "fs";
import moment from "moment";
import path from "path";
import loadPosts from "scripts/utils/load-posts";
import slugify from "slugify";
import "./utils/setup-module-path";

function fixForYaml(title) {
  if (title.indexOf(":") !== -1) {
    return `"${title.split('"').join('\\"')}"`;
  }

  return title;
}

const templatePath = path.join(__dirname, "utils/_post-template.md");
const template = fs.readFileSync(templatePath).toString();

const now = new Date();
const date = now.toJSON();

const title = process.argv[2];
const titleSlug = slugify(title, { remove: /[$*_+~.()'"!\-:@]/g, lower: true });
const titleForYaml = fixForYaml(title);
const postPath = `/${titleSlug}/`;

console.log("LOADING POSTS");
const posts = loadPosts({
  limit: 1,
  markdown: false
});
const previous = posts[0];
const previousPath = previous && previous.data ? previous.data.path : "";

console.log("LOADED, prev Path", previousPath);

const newContents = template
  .replace("TITLE", titleForYaml)
  .replace("DATE", date)
  .replace("PATH", postPath)
  .replace("PREVIOUS", previousPath || "");

const filePathDate = moment(now).format("YYYY-MM-DD");
const newFilePath = path.join(__dirname, `../src/pages/posts/${filePathDate}-${titleSlug}.md`);

console.log("WRITING POST", newFilePath);
fs.writeFileSync(newFilePath, newContents);

const nextSearch = /^next:( \/[^\/]+\/)?$/m; // eslint-disable-line
const match = nextSearch.exec(previous.contents);

if (match && match[0]) {
  const next = `next: ${postPath}`;
  const previousContents = previous.contents.replace(nextSearch, next);

  fs.writeFileSync(previous.path, previousContents);
}
