# Nicolai Askholt — Multimedia Design Portfolio

A single-page portfolio for Nicolai Askholt, a Multimedia Design student based in Copenhagen. The site presents work across UX/UI, digital product development, web design, branding, e-commerce, content design and interactive experiences.

## Website overview

The page is organised as a scrollable portfolio with:

- A hero section with Nicolai's name, location and internship availability.
- An About section describing his design approach and skills.
- Six selected projects, each with a description, role, category, visual gallery and link to the live project.
- A Contact section for internship enquiries, including email and LinkedIn links.

The featured projects are:

1. **Dankort Øremærket** — brand redesign, digital campaign and UX/UI.
2. **A Good Case** — product design and UX/UI.
3. **Clothing Website** — fashion, e-commerce and web design.
4. **Højskolendk** — web design, content and digital experience.
5. **MatchFinder** — UX/UI, app concept and product strategy.
6. **OS-frisørartikler** — e-commerce, branding and UX/UI.

## Interactions

- The sticky header links to the About, Work and Contact sections.
- The thin progress bar at the top follows the visitor's scroll position.
- Sections marked `.reveal` animate into view as they enter the viewport.
- Each project gallery can be navigated with previous/next buttons, horizontal scrolling or pointer dragging on desktop.
- Gallery counters update automatically, and the site respects the user's `prefers-reduced-motion` setting.
- Project links open the corresponding live project in a new tab.

## Project structure

```text
index.html       Page content and project data
styles.css       Layout, responsive styling and animations
script.js        Scroll effects and gallery interaction
assets/          Project screenshots and decorative symbols
```

The project images are grouped in `assets/` by project: `dankort`, `agoodcase`, `clothing`, `hojskolen`, `matchfinder` and `os`. Decorative transparent PNG symbols are stored in `assets/symbols/`.

## Run locally

No build step or dependencies are required. Open `index.html` directly in a browser, or serve the folder with a local static server. In VS Code, the Live Server extension can be used for a convenient preview.

## Deployment

Because this is a static HTML, CSS and JavaScript site, it can be deployed to GitHub Pages, Netlify, Vercel or any other static hosting service.

## Content notes

Project descriptions, gallery image paths and live-project URLs are maintained in `index.html`. The contact email currently uses the placeholder `you@example.com` and should be replaced before publishing.
