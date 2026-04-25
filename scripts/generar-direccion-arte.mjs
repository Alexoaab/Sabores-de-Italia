import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const imagenesPrincipales = [
  {
    input: "napolitana.jpg",
    outputBase: "napolitana-principal"
  },
  {
    input: "carbonara.jpg",
    outputBase: "carbonara-principal"
  },
  {
    input: "tiramisu.jpg",
    outputBase: "tiramisu-principal"
  },
  {
    input: "risotto.jpg",
    outputBase: "risotto-principal"
  }
];

const origen = "./src/img-copia";
const destino = "./src/img";

await fs.mkdir(destino, { recursive: true });

for (const imagen of imagenesPrincipales) {
  const rutaEntrada = path.join(origen, imagen.input);

  const desktopJpg = path.join(destino, `${imagen.outputBase}-desktop.jpg`);
  const mobileJpg = path.join(destino, `${imagen.outputBase}-mobile.jpg`);

  const desktopWebp = path.join(destino, `${imagen.outputBase}-desktop.webp`);
  const mobileWebp = path.join(destino, `${imagen.outputBase}-mobile.webp`);

  const desktopAvif = path.join(destino, `${imagen.outputBase}-desktop.avif`);
  const mobileAvif = path.join(destino, `${imagen.outputBase}-mobile.avif`);

  // Variante desktop
  await sharp(rutaEntrada)
    .resize(1200, 675, {
      fit: "cover",
      position: "centre"
    })
    .jpeg({ quality: 80 })
    .toFile(desktopJpg);

  // Variante mobile
  await sharp(rutaEntrada)
    .resize(800, 1000, {
      fit: "cover",
      position: "centre"
    })
    .jpeg({ quality: 80 })
    .toFile(mobileJpg);

  // Conversión desktop a WebP y AVIF
  await sharp(desktopJpg)
    .webp({ quality: 80 })
    .toFile(desktopWebp);

  await sharp(desktopJpg)
    .avif({ quality: 80 })
    .toFile(desktopAvif);

  // Conversión mobile a WebP y AVIF
  await sharp(mobileJpg)
    .webp({ quality: 80 })
    .toFile(mobileWebp);

  await sharp(mobileJpg)
    .avif({ quality: 80 })
    .toFile(mobileAvif);
}