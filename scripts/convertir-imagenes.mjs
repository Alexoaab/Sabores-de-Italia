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

  await sharp(`${origen}/${nombre}`)
    .resize(1200, 1200, {
      fit: "cover",
      position: "centre"
    })
    .toFile(`${destino}/${nombre}`);

  await sharp(`${destino}/${nombre}`)
    .webp({ quality: 80 })
    .toFile(`${destino}/${base}.webp`);

  await sharp(`${destino}/${nombre}`)
    .avif({ quality: 80 })
    .toFile(`${destino}/${base}.avif`);

  console.log(`Procesada correctamente: ${nombre}`);
}