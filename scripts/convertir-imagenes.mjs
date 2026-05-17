import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const imagenes = [
  "carbonara.jpg",
  "cafe.png",
  "mascarpone.png",
  "arroz.png",
  "caldo.png",
  "tiramisu.jpg",
  "salsa.png",
  "cocion.png",
  "masa.png",
  "napolitana.jpg",
  "risotto.jpg",
  "guanciale.png"
];

const origen = "./src/img-copia";
const destino = "./src/img";

await fs.mkdir(destino, { recursive: true });

for (const nombre of imagenes) {
  const ext = path.extname(nombre).toLowerCase();
  const base = path.basename(nombre, ext);
  const rutaEntrada = path.join(origen, nombre);
  const esPng = ext === ".png";

  const pipeline = sharp(rutaEntrada).resize(640, 640, {
    fit: "cover",
    position: "centre",
    withoutEnlargement: true
  });

  if (esPng) {
    await pipeline
      .clone()
      .png({
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(destino, nombre));
  } else {
    await pipeline
      .clone()
      .jpeg({
        quality: 72,
        mozjpeg: true,
        progressive: true
      })
      .toFile(path.join(destino, nombre));
  }

  await pipeline
    .clone()
    .webp({
      quality: esPng ? 60 : 62,
      alphaQuality: 70
    })
    .toFile(path.join(destino, `${base}.webp`));

  await pipeline
    .clone()
    .avif({
      quality: esPng ? 42 : 48
    })
    .toFile(path.join(destino, `${base}.avif`));

  console.log(`Procesada correctamente: ${nombre}`);
}