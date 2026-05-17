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
  const ext = path.extname(nombre);
  const base = path.basename(nombre, ext);
  const rutaEntrada = path.join(origen, nombre);

  await sharp(rutaEntrada)
    .resize(640, 640, {
      fit: "cover",
      position: "centre"
    })
    .jpeg({
      quality: 72,
      mozjpeg: true
    })
    .toFile(path.join(destino, nombre));

  await sharp(rutaEntrada)
    .resize(640, 640, {
      fit: "cover",
      position: "centre"
    })
    .webp({
      quality: 62
    })
    .toFile(path.join(destino, `${base}.webp`));

  await sharp(rutaEntrada)
    .resize(640, 640, {
      fit: "cover",
      position: "centre"
    })
    .avif({
      quality: 48
    })
    .toFile(path.join(destino, `${base}.avif`));

  console.log(`Procesada correctamente: ${nombre}`);
}