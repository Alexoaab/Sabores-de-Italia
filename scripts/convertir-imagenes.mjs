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
const tamanos = [320, 480, 640];

await fs.mkdir(destino, { recursive: true });

for (const nombre of imagenes) {
  const ext = path.extname(nombre).toLowerCase();
  const base = path.basename(nombre, ext);
  const rutaEntrada = path.join(origen, nombre);
  const esPng = ext === ".png";

  for (const tamano of tamanos) {
    const sufijo = tamano === 640 ? "" : `-${tamano}`;

    const pipeline = sharp(rutaEntrada).resize(tamano, tamano, {
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
        .toFile(path.join(destino, `${base}${sufijo}.png`));
    } else {
      await pipeline
        .clone()
        .jpeg({
          quality: tamano === 320 ? 68 : 72,
          mozjpeg: true,
          progressive: true
        })
        .toFile(path.join(destino, `${base}${sufijo}.jpg`));
    }

    await pipeline
      .clone()
      .webp({
        quality: esPng ? 58 : tamano === 320 ? 60 : 62,
        alphaQuality: 70
      })
      .toFile(path.join(destino, `${base}${sufijo}.webp`));

    await pipeline
      .clone()
      .avif({
        quality: esPng ? 40 : tamano === 320 ? 44 : 48
      })
      .toFile(path.join(destino, `${base}${sufijo}.avif`));
  }

  console.log(`Procesada correctamente: ${nombre}`);
}