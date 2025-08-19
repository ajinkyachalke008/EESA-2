# E-E-S-A · Government College Karad

Static, fully responsive site built with HTML, CSS, and JavaScript only. It includes:

- Hero with wave dividers and electrical-themed graphics
- Category cards (Students, Faculty, Events)
- Students: upload resumes (PDF) stored via localStorage metadata + Object URLs
- Faculty: upload profile info + optional photo preview (localStorage)
- Events: upcoming/past tabs with seed data and role badges
- Contact: mailto-based form
- Theme toggle (Warm/Electric)

## Run locally

- Open `index.html` directly in a browser, or serve the folder with any static server.
- No dependencies or build step required.

## Notes

- Uploads are demo-only and never leave your device. Files are referenced using temporary `blob:` URLs, and metadata is saved in `localStorage`.
- To clear demo data, use the Clear buttons in Students/Faculty sections or clear site data from your browser.

## Structure

- `index.html` — markup and SVG icon sprite
- `styles.css` — theme variables, layout, and components
- `script.js` — interactions, localStorage, and rendering