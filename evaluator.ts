import fs from "fs";
import axios from "axios";

export async function evaluateRefactor(
  filePath: string,
  apiKey: string
): Promise<string> {
  const content = fs.readFileSync(filePath, "utf8");
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
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
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return response.data.choices?.[0]?.message?.content || "No suggestion.";
}
