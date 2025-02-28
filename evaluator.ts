import fs from "fs";
import fetch from "node-fetch";

export async function evaluateRefactor(
  filePath: string,
  apiKey: string
): Promise<string> {
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
  const json: any = await response.json();
  return json.choices?.[0]?.message?.content || "No suggestion.";
}
