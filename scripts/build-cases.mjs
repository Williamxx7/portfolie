import { mkdir, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const publicDir = new URL("public/", root);
const origin = "https://williamlarsen.dk";

const cases = [
  {
    slug: "sentinel",
    tag: "Cybersikkerhed",
    title: "Sentinel",
    displayTitle: "Sentinel: sikkerhedsdashboard",
    description: "Et personligt dashboard til enheder, uptime, hændelser, breach-check og krypterede noter. Bygget til at give overblik over hjemmelabbet uden at samle data i løse regneark.",
    period: "2025 til 2026",
    status: "Live",
    statusClass: "live",
    tech: ["Astro", "TypeScript", "Cloudflare Workers", "D1", "Tailwind"],
    sections: [
      {
        title: "Problemet",
        paragraphs: [
          "Jeg havde brug for ét sted at se status på enheder, tjenester og hændelser i hjemmelabbet. Målet var ikke endnu et overvågningsværktøj, men et samlet overblik."
        ]
      },
      {
        title: "Løsningen",
        paragraphs: [
          "Sentinel samler enhedsregister, uptime, hændelseslog, breach-check og krypterede noter. En agent på Proxmox scanner netværket og sender data til dashboardet."
        ]
      },
      {
        title: "Arkitektur",
        paragraphs: [
          "Frontend er bygget med Astro og Tailwind. Data og API kører på Cloudflare Workers med D1. Agenten kører på Proxmox og sender kun de data, dashboardet har brug for."
        ]
      },
      {
        title: "Sikkerhed",
        paragraphs: [
          "Adgang kræver login. Hemmeligheder håndteres via Cloudflare secrets, og dashboardet er personligt og ikke beregnet til følsomme kundedata."
        ]
      },
      {
        title: "Status",
        paragraphs: [
          "Sentinel kører på sentinel.williamlarsen2005.workers.dev og bruges løbende til at holde styr på hjemmelabbet."
        ]
      }
    ],
    features: [
      "Enhedsregister med status",
      "Uptime og hændelseslog",
      "Breach-check",
      "Krypterede noter",
      "Automatisk netværksscanning fra Proxmox"
    ],
    links: [
      { label: "Se dashboard", href: "https://sentinel.williamlarsen2005.workers.dev/", primary: true }
    ],
    note: "Projektet er personligt og kræver login. Derfor er der ingen offentlig demo."
  },
  {
    slug: "egalitarian",
    tag: "P1 + P2 · AAU",
    title: "Egalitarian",
    displayTitle: "Egalitarian: Digital Management System",
    description: "Et internationalt studieprojekt om affaldsindsamlere i Brasilien. P1 var en ESP32-vægtenhed med Bluetooth, og P2 var en multi-kooperativ platform med rollebaseret adgang og JWT.",
    period: "2025 til 2026",
    status: "Studieprojekt",
    statusClass: "study",
    tech: ["Java", "Spring Boot", "PostgreSQL", "React Native", "TypeScript", "C++", "ESP32", "BLE", "JWT"],
    sections: [
      {
        title: "Problemet",
        paragraphs: [
          "Projektet skulle styrke gennemsigtighed og indtjening for affaldsindsamlere i Brasilien. Løsningen blev udviklet i et internationalt samarbejde med universiteter i Brasilien, Portugal og Holland."
        ]
      },
      {
        title: "P1: Vægtenhed og mobilapp",
        paragraphs: [
          "Første fase var en ESP32-baseret vægtenhed, der sender vægtdata til en mobilapp via Bluetooth. Løsningen gjorde det muligt at registrere indsamlede mængder digitalt i stedet for på papir."
        ]
      },
      {
        title: "P2: Multi-kooperativ platform",
        paragraphs: [
          "Anden fase var en platform med rollebaseret adgang, tenant-isolation og JWT-autentificering. Platformen samlede kooperativer, brugere og indsamlinger i én løsning."
        ]
      },
      {
        title: "Test og resultat",
        paragraphs: [
          "Løsningen opfyldte 13 funktionelle krav og blev valideret med acceptance-, funktionelle og integrationstest. Projektet blev udviklet i studiegruppen på AAU."
        ]
      }
    ],
    features: [
      "ESP32-vægtenhed",
      "Bluetooth til mobilappen",
      "Multi-kooperativ platform",
      "Rollebaseret adgang",
      "Tenant-isolation",
      "JWT-autentificering",
      "13 funktionelle krav",
      "Acceptance- og integrationstest"
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Williamxx7/Brasilien-p1" }
    ],
    note: "Gruppeprojekt på AAU. P1 og P2 er samlet her, fordi de udgør samme løsning."
  },
  {
    slug: "p3",
    tag: "P3 · AAU",
    title: "P3",
    displayTitle: "Akustisk tastetryk",
    description: "Et igangværende studieprojekt om akustisk genkendelse af tastetryk med Raspberry Pi, INMP441-mikrofon og PyTorch.",
    period: "2026",
    status: "I gang",
    statusClass: "wip",
    tech: ["Python", "PyTorch", "Raspberry Pi", "INMP441", "Signalbehandling"],
    sections: [
      {
        title: "Problemet",
        paragraphs: [
          "Projektet undersøger, om akustiske signaler fra tastetryk kan bruges til at genkende, hvilke taster der bliver trykket på. Det er et sikkerhedsprojekt om side-channel-information fra lyd."
        ]
      },
      {
        title: "Løsningen",
        paragraphs: [
          "Vi optager lyd med en INMP441-mikrofon på en Raspberry Pi og arbejder med signalbehandling og klassifikation i PyTorch. Målet er at vurdere, hvor stabilt og sikkert et sådant system kan genkende tastetryk."
        ]
      },
      {
        title: "Status",
        paragraphs: [
          "Projektet er i gang på 3. semester og er ikke afsluttet endnu. Derfor er der ingen offentlig demo eller repo-link."
        ]
      }
    ],
    features: [
      "Raspberry Pi-opsætning",
      "INMP441-mikrofon",
      "Lydoptagelse og signalbehandling",
      "Klassifikation med PyTorch",
      "Sikkerhedsperspektiv på side-channels"
    ],
    links: [],
    note: "Projektet er i gang og har ikke et offentligt repo endnu."
  },
  {
    slug: "skat",
    tag: "Finans",
    title: "Skatteberegner 2026",
    displayTitle: "Skatteberegner 2026",
    description: "En dansk skatteberegner med mellemregninger, effektiv skattesats, SU, studiejob, sammenligning og eksport.",
    period: "2026",
    status: "Live",
    statusClass: "live",
    tech: ["HTML", "CSS", "JavaScript", "xlsx", "jsPDF", "Cloudflare Workers"],
    sections: [
      {
        title: "Problemet",
        paragraphs: [
          "Skatteberegning bliver hurtigt uoverskuelig, når fradrag, AM-bidrag og kommuneskat skal lægges sammen. Mange beregnere viser kun resultatet."
        ]
      },
      {
        title: "Løsningen",
        paragraphs: [
          "Beregneren viser mellemregninger og den effektive skattesats. Den kan håndtere løn, SU, studiejob, baglæns beregning og sammenligning af to indkomster."
        ]
      },
      {
        title: "Sådan virker det",
        paragraphs: [
          "Alt regnes lokalt i browseren. Der er ingen server, der modtager indtastede tal, og resultatet kan eksporteres til regneark eller PDF."
        ]
      },
      {
        title: "Afgrænsning",
        paragraphs: [
          "Beregningen er vejledende og ikke økonomisk eller juridisk rådgivning. Satser og regler kan ændre sig."
        ]
      }
    ],
    features: [
      "Indkomst, AM-bidrag og kommuneskat",
      "SU og studiejob",
      "Sammenligning af to indkomster",
      "Baglæns beregning",
      "Månedligt budget",
      "Eksport til regneark og PDF"
    ],
    links: [
      { label: "Åbn beregner", href: "/skat/", primary: true },
      { label: "GitHub", href: "https://github.com/Williamxx7/Dansk_skat_beregner" }
    ],
    note: "Beregneren er et hjælpeværktøj og erstatter ikke en konkret vurdering fra Skattestyrelsen."
  },
  {
    slug: "exif",
    tag: "Privatliv",
    title: "EXIF Inspector",
    displayTitle: "EXIF Inspector",
    description: "Et browserbaseret værktøj til at læse EXIF-metadata og konvertere billedfiler uden upload.",
    period: "2026",
    status: "Live",
    statusClass: "live",
    tech: ["HTML", "CSS", "JavaScript", "exif-js", "JSZip", "Cloudflare Workers"],
    sections: [
      {
        title: "Problemet",
        paragraphs: [
          "Billeder indeholder ofte skjult metadata som kamera, tidspunkt og GPS. Det kan være nyttigt, men også privat."
        ]
      },
      {
        title: "Løsningen",
        paragraphs: [
          "EXIF Inspector viser metadata og gør det muligt at konvertere filer. Alt behandles i browseren, så billederne ikke forlader enheden."
        ]
      },
      {
        title: "Funktioner",
        paragraphs: [
          "Værktøjet kan læse EXIF, vise GPS og kameraoplysninger, konvertere billedfiler og samle filer i en ZIP."
        ]
      },
      {
        title: "Afgrænsning",
        paragraphs: [
          "Ikke alle filformater og metadatafelter understøttes. Værktøjet er lavet til almindelige billedfiler."
        ]
      }
    ],
    features: [
      "EXIF metadata og GPS",
      "Kamera og optagelsestid",
      "Filkonvertering i browseren",
      "Batch og ZIP-download",
      "Ingen upload til server"
    ],
    links: [
      { label: "Åbn værktøj", href: "/exif/", primary: true }
    ],
    note: "Billederne behandles lokalt i browseren og uploades ikke."
  }
];

const esc = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const absolute = path => `${origin}${path}`;

const breadcrumb = currentTitle => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Forside", item: `${origin}/` },
    { "@type": "ListItem", position: 2, name: "Projekter", item: `${origin}/projekter/` },
    { "@type": "ListItem", position: 3, name: currentTitle, item: "" }
  ]
});

const page = item => {
  const canonicalPath = `/projekter/${item.slug}/`;
  const canonical = absolute(canonicalPath);
  const description = item.description;
  const sections = item.sections.map(section => `<section class="case-section">
  <h2>${esc(section.title)}</h2>
  ${section.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("\n  ")}
</section>`).join("\n");

  const features = item.features && item.features.length ? `<section class="case-section">
  <h2>Funktioner</h2>
  <ul class="feature-list">
    ${item.features.map(feature => `<li>${esc(feature)}</li>`).join("\n    ")}
  </ul>
</section>` : "";

  const links = item.links.map(link => `<a class="${link.primary ? "" : "secondary"}" href="${esc(link.href)}"${link.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(link.label)} →</a>`).join("\n      ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title,
    url: canonical,
    description,
    applicationCategory: item.slug === "skat" ? "FinanceApplication" : item.slug === "exif" ? "UtilitiesApplication" : "SecurityApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    inLanguage: "da-DK",
    author: {
      "@type": "Person",
      name: "William Larsen",
      url: `${origin}/`
    }
  };

  const crumbs = breadcrumb(item.displayTitle);
  crumbs.itemListElement[2].item = canonical;

  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(item.displayTitle)} | William Larsen">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${absolute("/image.png")}">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta property="og:image:alt" content="William Larsen — cybersikkerhed, udvikling og fotografi">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="article">
<meta property="og:locale" content="da_DK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(item.displayTitle)} | William Larsen">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${absolute("/image.png")}">
<meta name="twitter:image:alt" content="William Larsen — cybersikkerhed, udvikling og fotografi">
<meta name="theme-color" content="#8b6c4f">
<title>${esc(item.displayTitle)} | William Larsen</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/projekter/case.css">
<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs, null, 2)}</script>
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">WX7</a>
  <nav class="site-nav" aria-label="Primær navigation">
    <a href="/">Forside</a>
    <a href="/projekter/" aria-current="page">Projekter</a>
    <a href="/fotografi/">Fotografi</a>
    <a href="https://lab.williamlarsen.dk/">Lab</a>
  </nav>
</header>
<main class="wrap">
  <nav class="breadcrumbs" aria-label="Brødkrumme">
    <a href="/">Forside</a><span>/</span><a href="/projekter/">Projekter</a><span>/</span><span>${esc(item.displayTitle)}</span>
  </nav>
  <p class="eyebrow">${esc(item.tag)}</p>
  <h1>${esc(item.displayTitle)}</h1>
  <p class="lead">${esc(description)}</p>
  <div class="meta-row">
    <span class="meta-chip ${esc(item.statusClass || "live")}">${esc(item.status)}</span>
    <span class="meta-chip">${esc(item.period)}</span>
  </div>
  <div class="tech-tags">
    ${item.tech.map(tech => `<span>${esc(tech)}</span>`).join("\n    ")}
  </div>
${sections}
${features}
${item.note ? `<p class="note">${esc(item.note)}</p>` : ""}
  <div class="case-links">
    ${links}
    <a class="secondary" href="/projekter/">Alle projekter →</a>
  </div>
  <a class="back-link" href="/projekter/">← Tilbage til projekter</a>
</main>
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

for (const item of cases) {
  const dir = new URL(`${item.slug}/`, new URL("projekter/", publicDir));
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), page(item));
}

console.log(`Generated ${cases.length} case pages.`);
