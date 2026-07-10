# Deploy guide

Step-by-step to push to GitHub and connect to Vercel. Target subdomain: `firzacank.vercel.app`.

> Note: Steps 2-3 are historical (the repo already exists at `github.com/FirzaCank/firzacank-portfolio-website` and Vercel is connected). They are kept as reference for setting up a fresh clone or a new project. For day-to-day updates, jump to [Future updates](#future-updates).

Estimated time: 15 minutes if everything goes smoothly.

---

## Prerequisites

- Git installed (`git --version` should work in terminal)
- GitHub account (you have: `FirzaCank`)
- Vercel account (free, sign in with GitHub)
- Folder open in terminal: `cd "/Users/hkn000112/Documents/Claude/Projects/Personal Website"`

---

## Step 1: Verify build works locally

Before pushing, make sure the production build succeeds. If this fails, deploy will too.

```bash
npm install
npm run build
```

You should see "Compiled successfully". If errors, fix them first before continuing.

Optional smoke test:

```bash
npm run start
```

Open http://localhost:3000 and click through About, Experience, Projects, a case study, Contact.

---

## Step 2: Init git + initial commit

In the project folder:

```bash
git init
git branch -M main
git add .
git commit -m "Initial portfolio site (Phase 1-11 complete)"
```

If git asks for identity:

```bash
git config user.name "Firza Chandra Sandjaya Putra"
git config user.email "firzasandjaya@gmail.com"
```

Then re-run the commit.

---

## Step 3: Create GitHub repo

1. Open https://github.com/new
2. Repository name: `personal-website` (or `firzacank-portfolio`, your choice)
3. Description: `Personal portfolio - Next.js 15 + Tailwind. firzacank.vercel.app`
4. Visibility: **Public**
5. Do NOT check "Add a README", "Add .gitignore", or "Choose a license" (you already have these)
6. Click **Create repository**

GitHub will show you a "push existing repository" snippet. Copy it. It looks like:

```bash
git remote add origin https://github.com/FirzaCank/personal-website.git
git branch -M main
git push -u origin main
```

Run those 3 commands in your terminal. If prompted for credentials, use a Personal Access Token (not your password):

- Generate at https://github.com/settings/tokens/new
- Scopes: check `repo`
- Copy token, paste when terminal asks for password

---

## Step 4: Connect Vercel

1. Open https://vercel.com/new
2. Sign in with GitHub if not already
3. Find your repo in the "Import Git Repository" list, click **Import**
4. Project Name: `firzacank` (this becomes your `firzacank.vercel.app` subdomain)
5. Framework Preset: Vercel should auto-detect **Next.js**
6. Root Directory: leave as `./`
7. Build & Output Settings: leave defaults
8. **Environment Variables**: add all three (the site deploys without the last two, but the chat assistant and contact form will return errors in production):
   - `NEXT_PUBLIC_SITE_URL` = `https://firzacank.vercel.app`
   - `GEMINI_API_KEY` = your Gemini API key (powers the RAG chat, free at [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys))
   - `RESEND_API_KEY` = your Resend API key (powers the contact form, [resend.com/api-keys](https://resend.com/api-keys))
9. Click **Deploy**

Wait ~2 minutes. You should see "Congratulations! Your project has been deployed."

---

## Step 5: Verify

Visit https://firzacank.vercel.app and check:

- [ ] Homepage loads
- [ ] All nav links work (About, Experience, Projects, Contact)
- [ ] At least one case study opens
- [ ] https://firzacank.vercel.app/robots.txt renders
- [ ] https://firzacank.vercel.app/sitemap.xml renders
- [ ] Favicon shows in browser tab (sage F)
- [ ] OG preview: paste link into https://www.opengraph.xyz/ to see the social card

---

## Future updates

Every time you push to `main`, Vercel auto-deploys.

Stage and commit files individually so each commit stays focused and no stray file slips in:

```bash
git add path/to/changed-file
git commit -m "fix copy - describe what changed"
git push
```

If you edited any portfolio content in `data/*.ts`, rebuild the RAG index first and commit the generated files too:

```bash
npm run build-rag
git add data/portfolio.json data/embeddings.json
git commit -m "chore rag - rebuild export and embeddings"
```

Preview deployments happen automatically for any other branch.

---

## Switching to custom domain later (firzacank.com)

When you buy the domain:

1. Vercel dashboard → your project → Settings → Domains → Add → enter `firzacank.com`
2. Follow Vercel's DNS instructions at your domain registrar (Cloudflare, Namecheap, etc.)
3. Wait for DNS propagation (5 min to a few hours)
4. Update env var: `NEXT_PUBLIC_SITE_URL=https://firzacank.com`
5. Redeploy (Vercel does this automatically when env var changes)

The old `firzacank.vercel.app` keeps working and auto-redirects to the custom domain.

---

## Troubleshooting

**Build fails on Vercel but works locally**
Check Vercel build log. Most common cause: TypeScript errors that pass locally because of stale cache. Delete `.next/` and `node_modules/`, run `npm install && npm run build` to reproduce.

**OG image returns 404 in production**
Edge runtime needs to compile; first request can be slow. Try refreshing after 10 seconds.

**MDX case study returns 404**
Check the filename matches the slug (e.g. `nuclear-policy-dna-sna.mdx`) and the slug is referenced in `data/projects.ts`.

**Push rejected**
If GitHub says "rejected", run `git pull origin main --rebase` first, resolve any conflicts, then `git push`.
