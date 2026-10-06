
import fs from "fs";
import path from "path";

const SRC = path.resolve("src");
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
})(SRC);

const byName = {};
for (const f of files) byName[path.basename(f)] = f;

for (const f of files.filter((x) => /\.jsx?$/.test(x))) {
  const text = fs.readFileSync(f, "utf8");
  const fixed = text.replace(/(from\s+|import\s+)"(\.[^"]+)"/g, (m, kw, p) => {
    const target = byName[path.basename(p)];
    if (!target) return m;
    let rel = path.relative(path.dirname(f), target).split(path.sep).join("/");
    if (!rel.startsWith(".")) rel = "./" + rel;
    return `${kw}"${rel}"`;
  });
  if (fixed !== text) {
    fs.writeFileSync(f, fixed);
    console.log("fixed:", path.relative(SRC, f));
  }
}
console.log("done");

