# Midterm Ninja Planner

A React + Vite web app version of your study planner.

## Run locally

1. Install dependencies:

	npm install

2. Start the dev server:

	npm run dev

3. Open the local URL shown in terminal (usually http://localhost:5173).

## Build for production

npm run build

The production files are generated in the dist folder.

## Deploy online with GitHub Pages

This project already includes a GitHub Actions workflow at .github/workflows/deploy.yml.

After pushing to the main branch:

1. Open your repo on GitHub.
2. Go to Settings > Pages.
3. Set Source to GitHub Actions.
4. Wait for the Deploy to GitHub Pages workflow to finish.
5. Your site will be available at:

	https://<your-github-username>.github.io/<your-repo-name>/

Notes:

- The Vite base path is set to ./ in vite.config.js so it works from a repo subpath.
- Progress is saved in browser localStorage under muso-ninja-planner-v2.
