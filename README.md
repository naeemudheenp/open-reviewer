# Open Reviewer - AI-Powered Code Review

![Open Reviewer](https://img.shields.io/badge/Open--Reviewer-AI--Powered-blueviolet?style=for-the-badge)

🚀 **Open Reviewer** is a powerful CLI tool that scans your JavaScript/TypeScript codebase, evaluates it using AI, and generates an insightful review report with suggestions for improvements.

## ✨ Features
- ✅ Scans your entire project for `.js`, `.jsx`, `.ts`, `.tsx` files.
- 🤖 Integrates with ** AI** for intelligent code analysis based on your pompt.
- 📄 Generates a **beautiful HTML report** for better visualization.
- 🔍 Highlights **code improvements**, best practices, and potential issues.
- 🎨 Styled with clean UI for better readability.

## 📦 Installation

You can install **Open Reviewer** globally using npm:

```sh
npm install -g open-reviewer
```

## 🚀 Usage

Run the following command in your project's root directory:

```sh
open-reviewer review
```

### 📌 Configuration
Before running the tool, create a configuration file in your project root named **`open-reviewer-config.json`** with the following content:

```json
{
  "apiKey": "your-groq-api-key",
  "prompt": "Check for code quality and improvements."
}
```

🔑 **Get your API Key** from [Groq](https://groq.com/).

⚠️ **If the configuration file is missing or the API key is incorrect, the tool will display a warning and exit.**

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

