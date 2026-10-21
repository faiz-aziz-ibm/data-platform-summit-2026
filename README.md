# IBM Expert Labs · Data Platform Summit 2026

Poster site for the summit (17–18 November 2026, IBM Hursley, Winchester), in the same design language as the promo film.

- `index.html` is the built page. GitHub Pages serves it as-is (`.nojekyll`).
- `assets/` holds the film (`summit-film.mp4`), posters, the IBM mark and the favicon.
- `tools/template.html` is the source. `tools/build.mjs` inlines the Hursley House line drawing (`tools/hursley.json`, 316 paths measured from a photo of the house), the UK map (`tools/uk.json`) and the November calendar.

```bash
node tools/build.mjs          # rebuild index.html after editing tools/template.html
node tools/serve.mjs 4173     # local preview at http://localhost:4173
```

Registration: https://ibm.briefingsource.com/register/Z7FRGAU6
