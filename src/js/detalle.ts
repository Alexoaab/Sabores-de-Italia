import "../scss/base.scss";
import "../scss/detalle.scss";

function initDetalleSecciones(): void {
  const botonesSeccion = document.querySelectorAll<HTMLButtonElement>(
    ".detalle-seccion .toggle-btn"
  );

  botonesSeccion.forEach((boton) => {
    const seccion = boton.closest<HTMLElement>(".detalle-seccion");
    const contenido = seccion?.querySelector<HTMLElement>(
      "ul, ol, .presentacion-contenido"
    );

    if (!contenido) return;

    const actualizarTexto = () => {
      boton.textContent = contenido.classList.contains("oculto")
        ? "Mostrar"
        : "Ocultar";
    };

    actualizarTexto();

    boton.addEventListener("click", () => {
      contenido.classList.toggle("oculto");
      actualizarTexto();
    });
  });
}

function initVideosDiferidos(): void {
  const placeholders = document.querySelectorAll<HTMLElement>(".video-placeholder");

  placeholders.forEach((placeholder) => {
    const videoId = placeholder.dataset.videoId;
    const videoTitle = placeholder.dataset.videoTitle || "Vídeo";

    if (!videoId) return;

    const cargarIframe = () => {
      if (placeholder.querySelector("iframe")) return;

      placeholder.innerHTML = `
        <iframe
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&cc_load_policy=1"
          title="${videoTitle}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;
    };

    placeholder.addEventListener("click", cargarIframe);

    placeholder.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        cargarIframe();
      }
    });
  });
}

async function cargarTranscripcion(key: string): Promise<string> {
  if (key === "det1") {
    const modulo = await import("./transcripciones/det1");
    return modulo.default;
  }

  if (key === "det2") {
    const modulo = await import("./transcripciones/det2");
    return modulo.default;
  }

  if (key === "det3") {
    const modulo = await import("./transcripciones/det3");
    return modulo.default;
  }

  if (key === "det4") {
    const modulo = await import("./transcripciones/det4");
    return modulo.default;
  }

  throw new Error("Clave de transcripción no válida.");
}

function initDetalleTranscripciones(): void {
  const botonesTranscripcion = document.querySelectorAll<HTMLButtonElement>(
    '.detalle-video .toggle-btn[aria-controls][data-transcription-key]'
  );

  botonesTranscripcion.forEach((boton) => {
    const id = boton.getAttribute("aria-controls");
    const key = boton.dataset.transcriptionKey;

    if (!id || !key) return;

    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    let cargada = false;

    const actualizarEstado = () => {
      const expandido = !contenedor.classList.contains("oculto");
      boton.setAttribute("aria-expanded", String(expandido));
      boton.textContent = expandido
        ? "Ocultar transcripción"
        : "Mostrar transcripción";
    };

    actualizarEstado();

    boton.addEventListener("click", async () => {
      const estaOculto = contenedor.classList.contains("oculto");

      if (estaOculto && !cargada) {
        contenedor.classList.remove("oculto");
        contenedor.classList.add("transcripcion--cargando");
        contenedor.classList.remove("transcripcion--error");
        contenedor.innerHTML = "<p>Cargando transcripción...</p>";

        try {
          const texto = await cargarTranscripcion(key);

          const bloques = texto
            .split("\n\n")
            .map((bloque) => bloque.trim())
            .filter((bloque) => bloque !== "");

          contenedor.innerHTML = `
            <h4>Transcripción del vídeo</h4>
            ${bloques.map((bloque) => `<p>${bloque}</p>`).join("")}
          `;

          cargada = true;
        } catch (error) {
          contenedor.innerHTML =
            "<p>No se ha podido cargar la transcripción en este momento.</p>";
          contenedor.classList.add("transcripcion--error");
          console.error("Error al cargar la transcripción:", error);
        } finally {
          contenedor.classList.remove("transcripcion--cargando");
          actualizarEstado();
        }

        return;
      }

      contenedor.classList.toggle("oculto");
      actualizarEstado();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDetalleSecciones();
  initVideosDiferidos();
  initDetalleTranscripciones();
});