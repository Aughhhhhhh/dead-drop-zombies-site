import { cp, mkdir, copyFile, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const output = new URL("dist/", root);
if (!output.href.startsWith(root.href))
  throw new Error("Build output is outside the project");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of [
  "index.html",
  "styles.css",
  "app.js",
  "core.js",
  "favicon.svg",
  ".nojekyll",
]) {
  await copyFile(new URL(file, root), new URL(file, output));
}
await cp(new URL("data/", root), new URL("data/", output), { recursive: true });
await cp(new URL("assets/", root), new URL("assets/", output), {
  recursive: true,
});
console.log("Static site ready in dist/");
