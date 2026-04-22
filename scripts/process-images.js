const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const INPUT  = "content/photography";
const OUTPUT = "public/images/photography";
const DATA   = "public/data/gallery.json";
const CACHE  = "public/data/gallery-cache.json";

// Responsive breakpoints
const WIDTHS = [400, 800, 1200, 1600];

async function loadCache() {
  try {
    return await fs.readJson(CACHE);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.ensureDir(path.dirname(CACHE));
  await fs.writeJson(CACHE, cache, { spaces: 2 });
}

function getCacheKey(category, file) {
  return `${category}/${file}`;
}

async function isCached(category, file, cache) {
  const key = getCacheKey(category, file);
  const entry = cache[key];
  if (!entry) return false;

  // Check source file mtime
  const inputPath = `${INPUT}/${category}/${file}`;
  const stat = await fs.stat(inputPath);
  const mtime = stat.mtimeMs;

  if (entry.mtime !== mtime) return false;

  // Verify at least one output file still exists
  const name = path.parse(file).name;
  const outDir = `${OUTPUT}/${category}`;
  const firstWidth = WIDTHS.find(w => true);
  const probe = `${outDir}/${name}-${firstWidth}.webp`;

  return fs.pathExists(probe);
}

async function processImage(file, category, cache) {
  const name      = path.parse(file).name;
  const inputPath = `${INPUT}/${category}/${file}`;
  const outDir    = `${OUTPUT}/${category}`;
  const key       = getCacheKey(category, file);

  // Return cached result if up-to-date
  if (await isCached(category, file, cache)) {
    return cache[key].result;
  }

  await fs.ensureDir(outDir);

  const src = sharp(inputPath).rotate();
  const meta = await src.clone().metadata();
  const aspectRatio = +(meta.width / meta.height).toFixed(4);

  const avifSrcset = [];
  const webpSrcset = [];

  for (const w of WIDTHS) {
    if (w > meta.width * 1.1) continue;

    const base = `${outDir}/${name}-${w}`;

    await src.clone()
      .resize(w, null, { withoutEnlargement: true })
      .avif({ quality: 60, effort: 4 })
      .toFile(`${base}.avif`);

    await src.clone()
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: 78, smartSubsample: true })
      .toFile(`${base}.webp`);

    const urlBase = `/images/photography/${category}/${name}-${w}`;
    avifSrcset.push(`${urlBase}.avif ${w}w`);
    webpSrcset.push(`${urlBase}.webp ${w}w`);
  }

  const placeholder = await src.clone()
    .resize(20)
    .webp({ quality: 20 })
    .toBuffer();
  const placeholderB64 = `data:image/webp;base64,${placeholder.toString("base64")}`;

  const result = {
    avifSrcset: avifSrcset.join(", "),
    webpSrcset: webpSrcset.join(", "),
    placeholder: placeholderB64,
    aspectRatio,
    name,
  };

  // Update cache entry
  const stat = await fs.stat(inputPath);
  cache[key] = { mtime: stat.mtimeMs, result };

  return result;
}

async function run() {
  console.log("📸 Processing images...");
  const cache = await loadCache();

  const categories = (await fs.readdir(INPUT)).filter(
    f => fs.statSync(`${INPUT}/${f}`).isDirectory()
  );

  let gallery = {};
  let skipped = 0;
  let processed = 0;

  for (const category of categories) {
    const files = (await fs.readdir(`${INPUT}/${category}`)).filter(f =>
      /\.(jpe?g|png|tiff?|webp)$/i.test(f)
    );

    console.log(`  [${category}] ${files.length} images`);
    gallery[category] = [];

    for (const file of files) {
      const cached = await isCached(category, file, cache);
      process.stdout.write(`    → ${file} ${cached ? "(cached) " : ""}... `);
      try {
        const result = await processImage(file, category, cache);
        gallery[category].push(result);
        cached ? skipped++ : processed++;
        console.log("✓");
      } catch (err) {
        console.log(`✗ ${err.message}`);
      }
    }
  }

  await fs.writeJson(DATA, gallery, { spaces: 2 });
  await saveCache(cache);

  console.log(`\n✅ Done — ${processed} processed, ${skipped} skipped (cached)`);
  console.log(`   gallery.json updated with ${Object.values(gallery).flat().length} images`);
}

run();