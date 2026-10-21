import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = new URL("../", import.meta.url);
const publicDir = new URL("public/", root);
const outDir = new URL("fotografi/", publicDir);
const origin = "https://portfolio.williamlarsen.dk";
const lastmod = "2026-10-21";

const gallery = JSON.parse(await readFile(new URL("data/gallery.json", publicDir), "utf8"));

const categories = [
  {
    key: "Bryllup",
    slug: "bryllup",
    label: "Bryllup",
    alt: "Bryllupsfotografi",
    title: "Bryllupsfotografi",
    description: "Bryllupsfotografi med fokus på stemning, detaljer og de små øjeblikke. Til private kunder og større arrangementer."
  },
  {
    key: "Sport",
    slug: "sport",
    label: "Sport",
    alt: "Sportfotografi",
    title: "Sport og event",
    description: "Sport- og eventfotografi med fokus på fart, bevægelse og øjeblikke, der ellers forsvinder."
  },
  {
    key: "portræt",
    slug: "portraet",
    label: "Portræt",
    alt: "Portrætfotografi",
    title: "Portrætfotografi",
    description: "Portrætter i naturligt lys til privat brug, LinkedIn og professionelle profiler."
  },
  {
    key: "Street_Photography",
    slug: "street",
    label: "Street",
    alt: "Streetfotografi",
    title: "Street photography",
    description: "Street photography fra byen med lys, skygger og mennesker i bevægelse."
  },
  {
    key: "landscape",
    slug: "landskab",
    label: "Landskab",
    alt: "Landskabsfotografi",
    title: "Landskab og arkitektur",
    description: "Landskaber og arkitektur fra København og rejser, ofte i naturligt lys."
  }
];

const esc = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const xml = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const srcLast = srcset => srcset.split(", ").pop().split(" ")[0];
const absolute = url => `${origin}${url}`;

const sizeFor = image => {
  const ratio = image.aspectRatio || 0.75;
  if (ratio >= 1) return { width: 1200, height: Math.round(1200 / ratio) };
  return { width: 800, height: Math.round(800 / ratio) };
};

const captionFor = (category, index) => `${category.label} · ${String(index + 1).padStart(2, "0")}`;

const breadcrumbData = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absolute(item.path)
  }))
});

const shell = ({ title, description, canonicalPath, ogImage, ogAlt, ogWidth, ogHeight, body, jsonLd = [], script = "" }) => {
  const canonical = absolute(canonicalPath);
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="${ogWidth}">
<meta property="og:image:height" content="${ogHeight}">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="da_DK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="twitter:image:alt" content="${esc(ogAlt)}">
<meta name="theme-color" content="#8b6c4f">
<title>${esc(title)}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/fotografi/style.css">
${jsonLd.map(data => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`).join("\n")}
${script}
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">WX7</a>
  <nav class="site-nav" aria-label="Primær navigation">
    <a href="/">Forside</a>
    <a href="/projekter/">Projekter</a>
    <a href="/fotografi/" aria-current="page">Fotografi</a>
    <a href="https://lab.williamlarsen.dk/">Lab</a>
  </nav>
</header>
${body}
<footer class="site-footer">
  <span>© 2026 William Larsen</span>
  <div class="footer-links">
    <a href="/projekter/">Projekter</a>
    <a href="/fotografi/">Fotografi</a>
    <a href="https://lab.williamlarsen.dk/">Lab</a>
    <a href="https://github.com/Williamxx7">GitHub</a>
    <a href="https://linkedin.com/in/william-larsen-5b12002a0/">LinkedIn</a>
  </div>
</footer>
</body>
</html>`;
};

const lightbox = `
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Fotogalleri" hidden>
  <button class="lb-close" type="button" aria-label="Luk galleri">×</button>
  <button class="lb-prev" type="button" aria-label="Forrige billede">‹</button>
  <figure>
    <img id="lightbox-img" alt="">
    <figcaption id="lightbox-caption"></figcaption>
  </figure>
  <button class="lb-next" type="button" aria-label="Næste billede">›</button>
</div>`;

await mkdir(outDir, { recursive: true });

const categoryCards = categories.map(category => {
  const images = gallery[category.key] || [];
  const first = images[0];
  const { width, height } = sizeFor(first);
  return `<a class="category-card" href="/fotografi/${category.slug}/">
  <picture>
    <source type="image/avif" srcset="${esc(first.avifSrcset)}" sizes="(max-width: 900px) 100vw, 50vw">
    <source type="image/webp" srcset="${esc(first.webpSrcset)}" sizes="(max-width: 900px) 100vw, 50vw">
    <img src="${esc(srcLast(first.webpSrcset))}" alt="${esc(category.alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">
  </picture>
  <div class="category-copy">
    <h2>${esc(category.label)}</h2>
    <p>${esc(category.description)}</p>
    <span>${images.length} billeder →</span>
  </div>
</a>`;
}).join("\n");

const indexBody = `
<main class="wrap">
  <nav class="breadcrumbs" aria-label="Brødkrumme">
    <a href="/">Forside</a><span>/</span><span>Fotografi</span>
  </nav>
  <p class="eyebrow">Fotografi</p>
  <h1>Fotografi</h1>
  <p class="lead">Et udvalg af bryllupper, sport, portrætter, street og landskab. Alle billeder er taget af William Larsen.</p>
  <div class="category-grid">
${categoryCards}
  </div>
</main>`;

const indexHtml = shell({
  title: "Fotografi — bryllup, sport, portræt og landskab | William Larsen",
  description: "Se et udvalg af William Larsens fotografi: bryllupper, sport, portrætter, street og landskab. Fotograferet i København og omegn.",
  canonicalPath: "/fotografi/",
  ogImage: absolute("/image.png"),
  ogAlt: "William Larsen — fotografi",
  ogWidth: 2400,
  ogHeight: 1260,
  body: indexBody,
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Fotografi",
      url: absolute("/fotografi/"),
      description: "Et udvalg af bryllupper, sport, portrætter, street og landskab.",
      hasPart: categories.map(category => ({
        "@type": "ImageGallery",
        name: category.label,
        url: absolute(`/fotografi/${category.slug}/`)
      }))
    }
  ]
});

await writeFile(new URL("index.html", outDir), indexHtml);

const sitemapUrls = [
  { loc: `${origin}/`, priority: "1.0" },
  { loc: `${origin}/projekter/`, priority: "0.8" },
  { loc: `${origin}/fotografi/`, priority: "0.9" },
  ...categories.map(category => ({ loc: absolute(`/fotografi/${category.slug}/`), priority: "0.7" }))
];

const imageEntries = [];

for (const category of categories) {
  const images = gallery[category.key] || [];
  const pagePath = `/fotografi/${category.slug}/`;
  const canonical = absolute(pagePath);
  const first = images[0];
  const firstSize = sizeFor(first);
  const imageMarkup = images.map((image, index) => {
    const { width, height } = sizeFor(image);
    const caption = captionFor(category, index);
    const full = absolute(srcLast(image.webpSrcset));
    return `<figure class="photo-card">
  <a class="photo-link" href="${esc(full)}" data-full="${esc(full)}" data-caption="${esc(caption)}" aria-label="Åbn ${esc(caption)}">
    <picture>
      <source type="image/avif" srcset="${esc(image.avifSrcset)}" sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw">
      <source type="image/webp" srcset="${esc(image.webpSrcset)}" sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw">
      <img src="${esc(srcLast(image.webpSrcset))}" alt="${esc(caption)}" width="${width}" height="${height}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ""}>
    </picture>
    <figcaption>${esc(caption)}</figcaption>
  </a>
</figure>`;
  }).join("\n");

  const imagesAbsolute = images.map(image => absolute(srcLast(image.webpSrcset)));
  const body = `
<main class="wrap">
  <nav class="breadcrumbs" aria-label="Brødkrumme">
    <a href="/">Forside</a><span>/</span><a href="/fotografi/">Fotografi</a><span>/</span><span>${esc(category.label)}</span>
  </nav>
  <p class="eyebrow">Fotografi</p>
  <h1>${esc(category.title)}</h1>
  <p class="lead">${esc(category.description)}</p>
  <div class="photo-grid">
${imageMarkup}
  </div>
  <a class="back-link" href="/fotografi/">← Alle kategorier</a>
</main>
${lightbox}`;

  const html = shell({
    title: `${category.title} | William Larsen`,
    description: category.description,
    canonicalPath: pagePath,
    ogImage: absolute(srcLast(first.webpSrcset)),
    ogAlt: `${category.alt} af William Larsen`,
    ogWidth: 1600,
    ogHeight: Math.round(1600 / (first.aspectRatio || 0.75)),
    body,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: category.title,
        url: canonical,
        description: category.description,
        image: imagesAbsolute,
        author: {
          "@type": "Person",
          name: "William Larsen",
          url: `${origin}/`
        }
      },
      breadcrumbData([
        { name: "Forside", path: "/" },
        { name: "Fotografi", path: "/fotografi/" },
        { name: category.label, path: pagePath }
      ])
    ],
    script: '<script src="/fotografi/gallery.js" defer></script>'
  });

  await mkdir(new URL(`${category.slug}/`, outDir), { recursive: true });
  await writeFile(new URL(`${category.slug}/index.html`, outDir), html);
  imageEntries.push({ page: canonical, images: images.map((image, index) => ({ loc: absolute(srcLast(image.webpSrcset)), title: captionFor(category, index) })) });
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

await writeFile(new URL("sitemap.xml", publicDir), sitemapXml);

const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map(entry => `  <url>
    <loc>${entry.page}</loc>
${entry.images.map(image => `    <image:image>
      <image:loc>${xml(image.loc)}</image:loc>
      <image:title>${xml(image.title)}</image:title>
    </image:image>`).join("\n")}
  </url>`).join("\n")}
</urlset>
`;

await writeFile(new URL("image-sitemap.xml", publicDir), imageSitemapXml);

const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/image-sitemap.xml
`;

await writeFile(new URL("robots.txt", publicDir), robots);

console.log(`Generated ${categories.length} category pages and ${imageEntries.reduce((sum, entry) => sum + entry.images.length, 0)} image entries.`);
