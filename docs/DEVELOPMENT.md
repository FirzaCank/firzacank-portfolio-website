# Local Development Guide

This guide details the environment setup, commands, and workflow for developing the portfolio site locally.

---

## Prerequisites

Ensure you have **Node.js** (LTS version recommended) installed on your system. You can verify your installation by running:

```bash
node --version
npm --version
```

---

## Setup & Running Locally

1. **Install Dependencies**
   Install all package dependencies defined in `package.json`:
   ```bash
   npm install
   ```

2. **Run the Development Server**
   Start a local Next.js development server:
   ```bash
   npm run dev
   ```

3. **Open the Application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser. The application supports Hot Module Replacement (HMR), so changes to your code will reflect instantly in the browser.

---

## Available Scripts

The following NPM scripts are configured in this project:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js app in development mode with hot-reloading at `localhost:3000`. |
| `npm run build` | Compiles and optimizes the application for production deployment. |
| `npm run start` | Starts the production server. Requires a prior production build (`npm run build`). |
| `npm run lint` | Runs ESLint to check for code issues, style errors, and best practices. |
| `npm run embeddings` | Rebuilds the RAG chat vector index at `data/embeddings.json`. Run after editing portfolio content, then commit the updated file. Requires `GEMINI_API_KEY` in `.env.local`. |

---

## Developer Documentation

To keep the development experience organized, the documentation is split into specialized guides:

- **[Project Structure](./STRUCTURE.md)**: Details on project directory structures, importing conventions, and architectural rules of thumb.
- **[Deployment Guide](./DEPLOY.md)**: Detailed step-by-step instructions to push to GitHub and deploy production builds to Vercel under the custom domain.
- **[RAG Chat Assistant](./RAG.md)**: How the portfolio chat works technically, and how to maintain the vector index.
