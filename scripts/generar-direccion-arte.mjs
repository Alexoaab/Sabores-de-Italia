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

  await sharp(rutaEntrada)
    .resize(1024, 576, {
      fit: "cover",
      position: "centre"
    })
    .jpeg({
      quality: 76,
      mozjpeg: true
    })
    .toFile(desktopJpg);

  await sharp(rutaEntrada)
    .resize(640, 800, {
      fit: "cover",
      position: "centre"
    })
    .jpeg({
      quality: 76,
      mozjpeg: true
    })
    .toFile(mobileJpg);

  await sharp(rutaEntrada)
    .resize(1024, 576, {
      fit: "cover",
      position: "centre"
    })
    .webp({
      quality: 66
    })
    .toFile(desktopWebp);

  await sharp(rutaEntrada)
    .resize(1024, 576, {
      fit: "cover",
      position: "centre"
    })
    .avif({
      quality: 52
    })
    .toFile(desktopAvif);

  await sharp(rutaEntrada)
    .resize(640, 800, {
      fit: "cover",
      position: "centre"
    })
    .webp({
      quality: 66
    })
    .toFile(mobileWebp);

  await sharp(rutaEntrada)
    .resize(640, 800, {
      fit: "cover",
      position: "centre"
    })
    .avif({
      quality: 52
    })
    .toFile(mobileAvif);

  console.log(`Procesada correctamente: ${imagen.input}`);
}