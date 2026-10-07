# psychic-train22222

Thura Nyi's portfolio, built with Next.js and inspired by https://hein.pages.dev, with a T monogram and personalized content.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run lint` and `npm run build` to validate changes.

## Pages

- `/` and `/about`: animated introduction and biography
- `/project`: nine featured projects in a responsive grid with interactive 3D laptop previews
- `/articles`: article index and featured article
- `/articles/[slug]`: Thura Nyi's Burmese React article
- `/gallery`: personal photos and captions
- `/projects`: alias for the project page
- `/contact`: email contact page
- `/resume`: original one-page resume preview and PDF download

All site navigation stays local. Project demos, source repositories, and social profiles remain external destinations.

## Personalization

- Shared navigation and social links: `app/components/site-shell.tsx`
- Biography: `app/components/portfolio.tsx`
- Contact email: `app/contact/page.tsx`
- Imported projects, experience, certificates, and photos: `app/data/profile.json`
- Project view model: `app/data/projects.ts`
- Article content: `app/data/articles.json`
- Resume PDF and high-resolution preview: `public/assets/thura-nyi-resume.pdf` and `public/assets/thura-nyi-resume-preview.png`
- Sidebar and favicon artwork: `public/assets/monogram.svg`

Personal content is imported from https://thuranyi.vercel.app/ and its linked blog at https://cultural-workshops-163557.framer.app/. The portrait, project screenshots, certificates, gallery, and original resume are stored locally. The design retains the Hein reference layout with Thura Nyi's name and T monogram. The blog source contains a malformed date, so the article displays its topic instead.

Reference artwork, fonts, and project models are stored locally. The animated sphere shader retains its original noise attribution. The Draco decoder under `public/draco` is a third-party runtime and is excluded from application linting.
