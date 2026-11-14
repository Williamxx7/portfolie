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
  },
  {
    slug: "homelab",
    tag: "Hjemmelab",
    title: "Homelab og Wazuh-lab",
    displayTitle: "Homelab og Wazuh-lab",
    description: "Et selvbygget hjemmelab på Proxmox med isolerede netværkssegmenter, Wazuh SIEM, Kali og et Ubuntu-mål. Brugt til at øve angreb og se, hvordan de samme hændelser ser ud i logs og alarmer.",
    period: "2025 til 2026",
    status: "I drift",
    statusClass: "live",
    tech: ["Proxmox VE", "Wazuh", "Kali Linux", "Ubuntu", "Docker", "Tailscale", "Hydra", "SSH"],
    figures: [
      {
        src: "/projekter/homelab/homelab-v4.png",
        srcset: "/projekter/homelab/homelab-v4.png 1x, /projekter/homelab/homelab-v4-2x.png 2x",
        href: "/projekter/homelab/homelab-v4-2x.png",
        alt: "Netværksdiagram over hjemmelabbet med Proxmox, LAN, lab-segment og isoleret målesegment",
        caption: "Netværksdiagram for hjemmelabbet. Adresserne er dokumentationsadresser eller placeholders, ikke de faktiske. Klik for at åbne i fuld størrelse."
      }
    ],
    sections: [
      {
        title: "Baggrund",
        paragraphs: [
          "Labbet startede som et sted at øve sig uden at røre produktion eller andre folks systemer. Målet var at få praktisk erfaring med virtualisering, netværksopdeling, logindsamling og detektion, ikke kun at køre et angreb én gang.",
          "Det er bygget på eget udstyr og bruges løbende til små øvelser, hvor jeg både kan følge angrebet fra Kali og se konsekvenserne i Wazuh bagefter."
        ]
      },
      {
        title: "Arkitektur",
        paragraphs: [
          "Proxmox VE kører på en Lenovo Legion Y520 med 8 vCPU, 23 GB RAM og en 256 GB NVMe. Der er tre bridges: LAN til hjemmenetværket, et lab-segment med NAT til internettet og et isoleret målesegment uden gateway.",
          "Wazuh kører som all-in-one i en VM med manager, indexer, filebeat og dashboard. Kali står i lab-segmentet, og Ubuntu-target står i målesegmentet, så angrebsmaskinen kan nå målet, men målet ikke kan nå internettet.",
          "Management på Proxmox og SSH er kun åbent via Tailscale, og lab-broen dropper resten. Der er taget snapshots efter hver milepæl, så en øvelse kan rulles tilbage."
        ]
      },
      {
        title: "Wazuh-setup",
        paragraphs: [
          "Target kører en Wazuh-agent, auditd med execve og whodata på /etc og /home. Det giver både netværks- og loghændelser og et billede af, hvilken bruger eller proces der ændrede noget.",
          "Juice Shop kører i Docker på port 3000 som et ekstra øvelsesmål. Agenttrafikken går på port 1514 og 1515 internt i målesegmentet, og Wazuh-manageren henter selv CVE-feeds og opdateringer via sit andet netkort."
        ]
      },
      {
        title: "Angrebsøvelse: Hydra mod SSH",
        paragraphs: [
          "Øvelsen var at se, hvad en brute force mod SSH efterlader sig. Fra Kali kørte jeg Hydra mod target med en ordliste og en bevidst svag testkonto. Der blev ikke brugt rigtige adgangskoder eller data fra andre systemer.",
          "Da Hydra fandt et match, loggede jeg ind over SSH som den konto for at give Wazuh noget at korrelere: mange mislykkede forsøg fra samme kilde efterfulgt af en vellykket session."
        ]
      },
      {
        title: "Loganalyse i Wazuh",
        paragraphs: [
          "I Wazuh gav forsøgene flere lag. sshd-logs viste gentagne Failed password og forsøg på ikke-eksisterende brugere, og Wazuh samlede dem til en brute force-detektion med kilden og antallet af forsøg.",
          "Det vellykkede SSH-login kunne ses som en separat hændelse, og auditd og whodata viste hvilke processer der blev startet, og om der blev skrevet i /etc eller /home. Det gjorde det muligt at følge rækkefølgen: scanning, brute force, login og aktivitet på maskinen.",
          "Pointen var ikke selve indbruddet, men at se hvor tidligt det kunne være opdaget, og hvilke spor der manglede, hvis man kun kiggede på én logkilde."
        ]
      },
      {
        title: "Afgrænsning",
        paragraphs: [
          "Alt foregår på eget udstyr i et isoleret segment uden adgang til internettet. Der ligger ingen kundedata, og testkonti og adgangskoder er kun beregnet til labbet.",
          "Labbet er privat og kan ikke tilgås udefra. Diagrammet er lavet til dokumentation og viser derfor ikke de faktiske adresser."
        ]
      },
      {
        title: "Næste skridt",
        paragraphs: [
          "Disken har været ustabil, så næste skridt er en ekstern backup og bedre køling. Derefter vil jeg arbejde videre med Active Response og Suricata for at koble netværksdetektion tættere på Wazuh."
        ]
      }
    ],
    features: [
      "Tre netværkssegmenter med isoleret mål",
      "Wazuh all-in-one SIEM",
      "Agent på target med auditd og whodata",
      "Hydra mod SSH i lukket lab",
      "Loganalyse af sshd, auth og procesaktivitet",
      "Snapshots før og efter øvelser"
    ],
    links: [],
    note: "Labbet er privat og har ingen offentlig demo. Diagram og IP-adresser er til dokumentation."
  },
  {
    slug: "pixel",
    tag: "Web",
    title: "Pixel-assistent",
    displayTitle: "Pixel: AI-assistent på siden",
    description: "En lille pixelfigur i ren JavaScript, der viser hvad chat-assistenten laver. Figuren skifter tema efter siden og reagerer, når chatten tænker eller svarer.",
    period: "2026",
    status: "Live",
    statusClass: "live",
    tech: ["HTML", "CSS", "JavaScript", "Cloudflare Workers"],
    sections: [
      {
        title: "Problemet",
        paragraphs: [
          "Chat-assistenten på siden havde brug for at vise, at den lyttede, tænkte og svarede. En anonym tænkeboble gav ingen fornemmelse af, hvad der foregik, og figuren skulle samtidig kunne bruges overalt uden at gøre siderne tungere."
        ]
      },
      {
        title: "Figuren",
        paragraphs: [
          "Pixel er en sprite på 16 x 24 felter, der tegnes direkte i siden med ren HTML og CSS. Der er ingen billeder, spritesheets eller biblioteker, så figuren fylder næsten ingenting og kan skaleres uden at blive sløret.",
          "Figuren har temaer, som vælges ud fra stien: kamera på /fotografi, certifikat på /certifikater og laptop på /projekter. Temaet kan overstyres med et data-attribut, hvis en side skal vise noget andet."
        ]
      },
      {
        title: "Animationer",
        paragraphs: [
          "Animationerne er blink, vejrtrækning, blik til siderne, nik, hop, vink, skrivning på laptop, snak, kamera og certifikat. De køres som små tilstande med egne intervaller, så figuren virker levende uden at kræve en animationspakke.",
          "Chat-widgeten sender events som williamchat:open, williamchat:thinking, williamchat:reply og williamchat:done. Figuren lytter på dem, vinker når panelet åbnes, skriver mens svaret bliver hentet og snakker et øjeblik, når svaret er kommet."
        ]
      },
      {
        title: "Chatten",
        paragraphs: [
          "Selve chatten er en lille widget i vanilla JavaScript. Den viser samtalen i et flydende panel, holder styr på historikken og sender beskeder til en Cloudflare Worker, som står for svarene.",
          "Der er sat grænser for længden på beskeder og antallet af udvekslinger, og der er timeout, hvis serveren ikke svarer. Fejl vises i panelet med et link videre til kontaktsektionen i stedet for en teknisk fejlmeddelelse."
        ]
      },
      {
        title: "Tilgængelighed",
        paragraphs: [
          "Hvis systemet er sat til reduceret bevægelse, står figuren stille. Panelet kan lukkes med Escape, knapperne har aria-expanded, og fokus flyttes tilbage til figuren, når chatten lukkes, så den også kan bruges med tastatur."
        ]
      },
      {
        title: "Afgrænsning",
        paragraphs: [
          "Assistenten svarer kun om Williams uddannelse, projekter, erfaring og fotografi. Den er ikke en generel chatbot, og når samtalen rammer sin grænse, henviser den til kontaktsektionen."
        ]
      }
    ],
    features: [
      "Pixelfigur uden billeder eller biblioteker",
      "Tema efter side: kamera, certifikat og laptop",
      "Reagerer på chat-events",
      "Reduceret bevægelse respekteres",
      "Chat-widget i vanilla JavaScript",
      "Svar via Cloudflare Worker"
    ],
    links: [
      { label: "Se siden", href: "https://williamlarsen.dk/", primary: true },
      { label: "GitHub", href: "https://github.com/Williamxx7/portfolie" }
    ],
    note: "Koden ligger i portfolie-repoet som pixel-william.js og widget.js."
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

  const figures = item.figures && item.figures.length ? item.figures.map(figure => {
    const img = `<img src="${esc(figure.src)}"${figure.srcset ? ` srcset="${esc(figure.srcset)}"` : ""} alt="${esc(figure.alt)}" loading="lazy" decoding="async">`;
    const media = figure.href ? `<a class="case-figure-link" href="${esc(figure.href)}" data-lightbox-src="${esc(figure.href)}" data-lightbox-alt="${esc(figure.alt)}">${img}</a>` : img;
    return `<figure class="case-figure">
  ${media}
  ${figure.caption ? `<figcaption>${esc(figure.caption)}</figcaption>` : ""}
</figure>`;
  }).join("\n") + "\n" : "";

  const lightbox = item.figures && item.figures.length ? `<div class="case-lightbox" id="case-lightbox" role="dialog" aria-modal="true" aria-label="Billede i fuld størrelse" hidden>
  <button class="case-lightbox-close" type="button" aria-label="Luk billedet">&times;</button>
  <img alt="">
</div>
<script>
(function () {
  var box = document.getElementById('case-lightbox');
  if (!box) return;
  var img = box.querySelector('img');
  var closeBtn = box.querySelector('.case-lightbox-close');
  var lastFocus = null;
  function open(src, alt) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    box.hidden = false;
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    img.removeAttribute('src');
    document.body.classList.remove('lightbox-open');
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-lightbox-src]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      open(link.getAttribute('data-lightbox-src'), link.getAttribute('data-lightbox-alt'));
    });
  });
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (event) {
    if (event.target === box) close();
  });
  document.addEventListener('keydown', function (event) {
    if (!box.hidden && event.key === 'Escape') close();
  });
})();
</script>` : "";

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
<link rel="icon" type="image/svg+xml" href="/favicon-20261021.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/projekter/case-20261021d.css">
<link rel="stylesheet" href="/nav-20261021c.css">
<script src="/nav-20261021.js" defer></script>
<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs, null, 2)}</script>
</head>
<body>
<header class="wx-header">
  <div class="wx-header-inner">
    <a class="wx-logo" href="/">WX7</a>
    <button class="wx-menu-btn" type="button" aria-expanded="false" aria-controls="wx-nav" aria-label="Åbn menu">
      <span></span><span></span><span></span>
    </button>
    <nav class="wx-nav" id="wx-nav" aria-label="Primær navigation">
      <a href="/">Forside</a>
      <a href="/projekter/" class="is-active" aria-current="page">Projekter</a>
      <a href="/fotografi/">Fotografi</a>
      <a href="/certifikater/">Certifikater</a>
      <a href="/ctf/">CTF</a>
      <a href="https://lab.williamlarsen.dk/">Lab</a>
    </nav>
  </div>
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
${figures}${sections}
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
    <a href="/certifikater/">Certifikater</a>
      <a href="/ctf/">CTF</a>
    <a href="https://lab.williamlarsen.dk/">Lab</a>
    <a href="https://github.com/Williamxx7">GitHub</a>
    <a href="https://linkedin.com/in/william-larsen-5b12002a0/">LinkedIn</a>
  </div>
</footer>
    <div class="pixel-chat">
        <div class="pixel-chat-bubble" role="status">Stil spørgsmål om William</div>
        <div data-pixel-william data-chat-trigger="true" data-scale="4"></div>
    </div>
    <script src="/pixel-william.js" defer></script>
    <script src="/widget.js" data-endpoint="https://william-chat.williamlarsen2005.workers.dev" data-contact="https://williamlarsen.dk/#kontakt" data-hide-button="true" data-pixel-trigger="true" defer></script>
${lightbox}
</body>
</html>`;
};

for (const item of cases) {
  const dir = new URL(`${item.slug}/`, new URL("projekter/", publicDir));
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), page(item));
}

console.log(`Generated ${cases.length} case pages.`);
