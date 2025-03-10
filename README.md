# Open Reviewer - AI-Powered Code Review

![Open Reviewer](https://img.shields.io/badge/Open--Reviewer-AI--Powered-blueviolet?style=for-the-badge)

🚀 **Open Reviewer** is a powerful CLI tool that scans your JavaScript/TypeScript codebase, evaluates it using AI, and generates an insightful review report with suggestions for improvements.

## ✨ Features

- ✅ Scans your entire project for `.js`, `.jsx`, `.ts`, `.tsx` files.
- 🤖 Integrates with **AI** for intelligent code analysis based on your prompt.
- 📄 Generates a **beautiful HTML report** for better visualization.
- 🔍 Highlights **code improvements**, best practices, and potential issues.
- 🎨 Styled with a clean UI for better readability.

## 🚀 Usage

Run the following command in your project's root directory:

```sh
npx open-reviewer review
```

### 📌 Configuration

Before running the tool, set up the required environment variables in your project where your planning to run the tool:

```sh
GROQ_API_KEY="your-groq-api-key"
DEFAULT_PROMPT=""
GROQ_MODEL=""//optional
```

🔑 **Get your API Key** from [Groq](https://groq.com/).

⚠️ **If the API key is missing, the tool will display a warning and exit.**

## 🌐 Viewing the HTML Report

After running the analysis, an HTML report will be generated in your project root as **`review_report.html`**. You can open it using **Live Server**:

### 🚀 Using VS Code Live Server Extension

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Right-click `review_report.html` and select **"Open with Live Server"**.

### 🖥️ Using Live Server via CLI

Alternatively, you can use `npx` to serve the file:

```sh
npx live-server --open=review_report.html
```

---

💡 **Enhance your code reviews today with Open Reviewer!** 🚀
