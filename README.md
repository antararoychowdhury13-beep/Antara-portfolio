# Antara — food creator website

This repository is the **public website only**. It is a ready-to-serve static site; there is nothing to build.

## Hosting on Cloudflare Pages
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: **/**

`_headers` sets security headers automatically on Cloudflare Pages.

## Updating content
Content is edited in the private **Antara Studio** file, which stays on Antara's own computer and is never uploaded here.
In the Studio, press **Publish to website**, then upload the downloaded `content.json` to this repository (replace the old one). Cloudflare redeploys automatically.

## Live Instagram, stories & YouTube
`functions/api/social.js` runs on Cloudflare and feeds the site every 10 minutes:
new Instagram reels/posts, Instagram stories (last 24h) and the latest YouTube videos.

Cloudflare settings needed (Workers & Pages → antara-portfolio → Settings):
- **Variables and secrets** → add secret `IG_TOKEN` = Instagram access token (from Meta's developer site).
- **Bindings** → add KV namespace binding named `SOCIAL` (keeps the token renewed and the feed cached).

Without `IG_TOKEN` the site still shows the saved reels and the latest YouTube video.
