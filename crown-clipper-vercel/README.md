# Crown & Clipper — Vercel public site

This is the Next.js source for the public Crown & Clipper site. It is designed for the existing Vercel Hobby project at https://crown-and-clipper-barber.vercel.app.

## How it works

- The public pages and calendar render on Vercel.
- The photo manifest and JPGs are read through the Vercel API from the existing GPT photo manager. The `Manage photos` link redirects to https://crown-and-clipper-barber.otttt.chatgpt.site/photos. Updating a photo there updates what the Vercel site displays after its short image cache expires.
- The booking form sends requests through a Vercel API route to the existing booking service on that GPT site. The same Sunday closure and opening hours are enforced there.
- The `Maybe later` button closes the welcome offer and remembers the choice on the visitor's device.

This arrangement depends on both public hosts remaining available. No Upstash, Vercel Blob or image password is needed on Vercel. To change the GPT site address, edit `lib/photo-source.ts` and redeploy.

## Deploy from GitHub

1. Push this directory to a GitHub repository. The included `.gitignore` excludes local builds and environment files.
2. In the existing Vercel project, choose **Connect Git** and select the repository.
3. Keep the framework preset as Next.js and the project root as the repository root.
4. Deploy the `main` branch to Production. Later pushes to `main` can trigger new deployments.

This project is a fictional assessment business. The free Hobby plan has usage limits and cannot guarantee uninterrupted availability.
