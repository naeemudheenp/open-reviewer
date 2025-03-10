#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import axios from "axios";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import 'dotenv/config';


async function loadModules() {
  const chalk = (await import("chalk")).default;
  return { chalk };
}

// Fetch values from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const DEFAULT_PROMPT = process.env.DEFAULT_PROMPT;

// Validate API key
if (!GROQ_API_KEY) {
  console.error("❌ Missing Groq API Key. Please set GROQ_API_KEY in your environment variables.");
  process.exit(1);
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Scan project for files
const scanProject = (dir) =>
  glob.sync(`${dir}/**/*.{js,jsx,ts,tsx}`, { ignore: ["node_modules/**", "dist/**", ".env"] });

// Analyze code with AI
const analyzeCode = async (code, prompt) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: process.env.GROQ_MODEL || "qwen-2.5-32b",
        messages: [
          { role: "system", content: `You are a senior code reviewer. ${prompt} . "You are an experienced senior code reviewer. Analyze the given code for quality, best practices, and improvements. Provide feedback only when necessary. Ensure that your response is formatted in HTML for clear presentation. The feedback should be concise, structured, and easily understandable, suitable for use as a code review comment. If changes are required, suggest them with a brief explanation. Otherwise, acknowledge well-written code. The response should be in HTML format. give proper heading and subheading.it should be properly spaced and formatted. it should be easy to read and understand. Give proper spacing between each errors like each section. Give overall suggetion only once at the end of the review. not for each files.We can ignore comments which are not that critical.Also show original code above suggested fix."` },
          { role: "user", content: `Review this code:\n\n${code}` },
        ],
      },
      {
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error communicating with Groq API:", error.response?.data || error.message);
    return "Error analyzing code.";
  }
};

// Run the analysis
const runAnalysis = async (options) => {
  const { chalk } = await loadModules();
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
        pre { background: #f4f4f4; padding: 10px; border-radius: 20px; overflow-x: auto; }
        .feedback { background: #e8f5e9; padding: 10px; border-left: 5px solid #4caf50; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>AI Code Review Report</h1>
  `;

  for (const file of files) {
    const code = fs.readFileSync(file, "utf-8");
    console.log(chalk.yellow(`📂 Reviewing: ${file}`));

    const feedback = await analyzeCode(code, DEFAULT_PROMPT);


    htmlContent += `
      <h2>Feedback for ${file}</h2>
      <div class="feedback">${feedback}</div>
    `;
  }

  htmlContent += `</body></html>`;
  fs.writeFileSync(reportFilePath, htmlContent, "utf-8");
  console.log(chalk.blue(`📄 Review report saved to: ${reportFilePath}`));
};

// CLI setup
yargs(hideBin(process.argv))
  .command(
    "review",
    "Analyze the codebase using AI",
    (yargs) => yargs.option("prompt", { alias: "p", type: "string", describe: "Custom review criteria" }),
    runAnalysis
  )
  .demandCommand()
  .help()
  .argv;
