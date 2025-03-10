#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

import axios from "axios";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";



async function loadModules() {
  const chalk = (await import("chalk")).default;
  return { chalk };
}


const configFilePath = path.join(process.cwd(), "open-reviewer-config.json");
let GROQ_API_KEY = "";
let DEFAULT_PROMPT = "Check for code quality and improvements.";

if (fs.existsSync(configFilePath)) {
  try {
    const config = fs.readJsonSync(configFilePath);
    GROQ_API_KEY = config.apiKey || "";
    DEFAULT_PROMPT = `${config.prompt}. Make sure the repsponse can be used as a code review comment.it should be esaily understandable.Only suggest code changes if necessary.Also the response should be in html format.`;
  } catch (error) {
    console.error("❌ Error reading config file:", error.message);
    process.exit(1);
  }
} else {
  console.warn("⚠️ Config file 'open-reviewer-config.json' not found. Please create it with API key and prompt.");
  process.exit(1);
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";


const scanProject = (dir) => glob.sync(`${dir}/**/*.{js,jsx,ts,tsx}`, { ignore: ["node_modules/**", "dist/**", ".env", "open-reviewer-config.json"] });


const analyzeCode = async (code, prompt) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "qwen-2.5-32b",
        messages: [
          { role: "system", content: `You are a senior code reviewer. ${prompt}` },
          { role: "user", content: `Review this code:\n\n${code}` }
        ]
      },
      {
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error communicating with Groq API:", error.response?.data || error.message);
    return "Error analyzing code.";
  }
};


const runAnalysis = async (options) => {
  const { chalk } = await loadModules();

  if (!GROQ_API_KEY) {
    console.error(chalk.red("❌ Missing Groq API Key in 'open-reviewer-config.json'."));
    process.exit(1);
  }

  const files = scanProject(process.cwd());
  console.log(chalk.blue(`🔍 Scanning ${files.length} files...`));

  const reportFilePath = path.join(process.cwd(), "review_report.html");
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code Review Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { color: #333; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .feedback { background: #e8f5e9; padding: 10px; border-left: 5px solid #4caf50; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>AI Code Review Report</h1>
  `;

  for (const file of files) {
    const code = fs.readFileSync(file, "utf-8");
    console.log(chalk.yellow(`📂 Reviewing: ${file}`));

    const feedback = await analyzeCode(code, options.prompt || DEFAULT_PROMPT);
    console.log(chalk.green(`✅ Feedback for ${file}:
${feedback}
`));

    htmlContent += `
      <h2>Feedback for ${file}</h2>

      <div class="feedback">${feedback}</div>
    `;
  }

  htmlContent += `</body></html>`;
  fs.writeFileSync(reportFilePath, htmlContent, "utf-8");
  console.log(chalk.blue(`📄 Review report saved to: ${reportFilePath}`));
};



yargs(hideBin(process.argv))
  .command(
    "review",
    "Analyze the codebase using AI",
    (yargs) =>
      yargs.option("prompt", { alias: "p", type: "string", describe: "Custom review criteria" }),
    runAnalysis
  )
  .demandCommand()
  .help()
  .argv;
