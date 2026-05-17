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

const variantes = [
  {
    sufijo: "desktop",
    width: 1024,
    height: 576
  },
  {
    sufijo: "mobile",
    width: 640,
    height: 800
  }
];

for (const imagen of imagenesPrincipales) {
  const rutaEntrada = path.join(origen, imagen.input);

  for (const variante of variantes) {
    const rutaBase = path.join(destino, `${imagen.outputBase}-${variante.sufijo}`);

    const pipeline = sharp(rutaEntrada).resize(variante.width, variante.height, {
      fit: "cover",
      position: "centre",
      withoutEnlargement: true
    });

    await pipeline
      .clone()
      .jpeg({
        quality: 76,
        mozjpeg: true,
        progressive: true
      })
      .toFile(`${rutaBase}.jpg`);

    await pipeline
      .clone()
      .webp({
        quality: 66
      })
      .toFile(`${rutaBase}.webp`);

    await pipeline
      .clone()
      .avif({
        quality: 52
      })
      .toFile(`${rutaBase}.avif`);
  }

  console.log(`Procesada correctamente: ${imagen.input}`);
}