import fs from "fs";
import path from "path";
import { prompt } from "enquirer";
import { execSync } from "child_process";
import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function getConfig() {
  const response = await prompt([
    {
      type: "multiselect",
      name: "fileTypes",
      message: "Select file types to scan",
      choices: [".js", ".ts"],
    },
    {
      type: "input",
      name: "apiKey",
      message: "Enter your OpenRouter API key",
      initial: OPENROUTER_API_KEY || "",
      required: true,
    },
  ]);
  return response;
}

function getFiles(dir: string, extensions: string[]): string[] {
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

function pickRandomFiles(files: string[], count: number): string[] {
  const shuffled = [...files].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function evaluateRefactor(filePath: string, apiKey: string) {
  const content = fs.readFileSync(filePath, "utf8");
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a TypeScript refactoring expert. Given a file, determine if it needs refactoring and provide a concise suggestion.",
          },
          {
            role: "user",
            content: `Evaluate if this TypeScript/JavaScript file benefits from refactoring. If yes, suggest improvements:
        \n${content}\n`,
          },
        ],
      }),
    }
  );
  const json = await response.json();
  return json.choices?.[0]?.message?.content || "No suggestion.";
}

(async () => {
  const { fileTypes, apiKey } = await getConfig();
  const files = getFiles(process.cwd(), fileTypes);
  if (files.length === 0) {
    console.log("No matching files found.");
    return;
  }

  const selectedFiles = pickRandomFiles(files, Math.min(5, files.length));
  console.log(`Evaluating ${selectedFiles.length} random files...\n`);

  for (const file of selectedFiles) {
    console.log(`\n--- Evaluating: ${file} ---`);
    const suggestion = await evaluateRefactor(file, apiKey);
    console.log(suggestion);
  }
})();
