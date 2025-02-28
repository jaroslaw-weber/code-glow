import { prompt } from "enquirer";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export type ConfigResponse = {
  fileTypes: string[];
  apiKey: string;
};

export async function getConfig(): Promise<ConfigResponse> {
  const response = await prompt<ConfigResponse>([
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
