import fs from "fs";
import path from "path";

export function getFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extensions));
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

export function pickRandomFiles(files: string[], count: number): string[] {
  const shuffled = [...files].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
