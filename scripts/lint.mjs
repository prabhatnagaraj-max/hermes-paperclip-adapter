import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const repoRoot = process.cwd();
const roots = [".github", "src", "crm-data-quality"];
const extensions = new Set([".js", ".mjs", ".ts", ".json", ".md", ".yml", ".yaml"]);
const failures = [];

function extensionFor(file) {
  const dot = file.lastIndexOf(".");
  return dot === -1 ? "" : file.slice(dot);
}

function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
      continue;
    }

    if (entry.isFile() && extensions.has(extensionFor(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkFile(file) {
  const text = readFileSync(file, "utf8");
  const rel = relative(repoRoot, file);

  if (!text.endsWith("\n")) {
    failures.push(`${rel}: missing trailing newline`);
  }

  const lines = text.split("\n");
  lines.forEach((line, index) => {
    if (/[ \t]$/.test(line)) {
      failures.push(`${rel}:${index + 1}: trailing whitespace`);
    }
  });
}

for (const root of roots) {
  const absoluteRoot = join(repoRoot, root);
  if (statSync(absoluteRoot).isDirectory()) {
    for (const file of collectFiles(absoluteRoot)) {
      checkFile(file);
    }
  }
}

if (failures.length > 0) {
  console.error("Repository lint failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Repository lint passed.");
}
