import { getConfig } from "./config";
import { getFiles, pickRandomFiles } from "./fileHandler";
import { evaluateRefactor } from "./evaluator";

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
