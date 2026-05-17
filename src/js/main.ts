import "../scss/main.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";

type TranscriptionKey = "det1" | "det2" | "det3" | "det4";

const transcriptionLoaders: Record<TranscriptionKey, () => Promise<string>> = {
  det1: async () => (await import("./transcripciones/det1")).default,
  det2: async () => (await import("./transcripciones/det2")).default,
  det3: async () => (await import("./transcripciones/det3")).default,
  det4: async () => (await import("./transcripciones/det4")).default
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarAOS();
  inicializarLightbox();
  inicializarSwiper();
  inicializarBotonesSeccion();
  inicializarBotonesTranscripcion();
  inicializarFormulario();
});

function inicializarAOS(): void {
  if (!document.querySelector("[data-aos]")) return;

  AOS.init({
    duration: 800,
    once: false
  });
}

function inicializarLightbox(): void {
  if (!document.querySelector(".glightbox")) return;

  GLightbox({
    selector: ".glightbox"
  });
}

function inicializarSwiper(): void {
  if (!document.querySelector(".swiper")) return;

  new Swiper(".swiper", {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 }
    }
  });
}

function inicializarBotonesSeccion(): void {
  const botones = document.querySelectorAll<HTMLButtonElement>(
    ".detalle-seccion .toggle-btn"
  );

  botones.forEach((boton) => {
    const seccion = boton.closest<HTMLElement>(".detalle-seccion");
    const contenido = seccion?.querySelector<HTMLElement>(
      "ul, ol, .presentacion-contenido"
    );

    if (!contenido) return;

    const actualizarTexto = (): void => {
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

function inicializarBotonesTranscripcion(): void {
  const botones = document.querySelectorAll<HTMLButtonElement>(
    '.detalle-video .toggle-btn[aria-controls][data-transcription-key]'
  );

  botones.forEach((boton) => {
    const id = boton.getAttribute("aria-controls");
    const key = boton.dataset.transcriptionKey as TranscriptionKey | undefined;

    if (!id || !key || !(key in transcriptionLoaders)) return;

    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    let cargada = false;

    const actualizarEstado = (): void => {
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
        await cargarTranscripcion(key, contenedor);
        cargada = !contenedor.classList.contains("transcripcion--error");
        actualizarEstado();
        return;
      }

      contenedor.classList.toggle("oculto");
      actualizarEstado();
    });
  });
}

async function cargarTranscripcion(
  key: TranscriptionKey,
  contenedor: HTMLElement
): Promise<void> {
  contenedor.classList.remove("oculto");
  contenedor.classList.add("transcripcion--cargando");
  contenedor.classList.remove("transcripcion--error");
  contenedor.innerHTML = "<p>Cargando transcripción...</p>";

  try {
    const texto = await transcriptionLoaders[key]();
    const bloques = texto
      .split("\n\n")
      .map((bloque) => bloque.trim())
      .filter((bloque) => bloque !== "");

    contenedor.innerHTML = `
      <h4>Transcripción del vídeo</h4>
      ${bloques.map((bloque) => `<p>${bloque}</p>`).join("")}
    `;
  } catch (error) {
    contenedor.innerHTML =
      "<p>No se ha podido cargar la transcripción en este momento.</p>";
    contenedor.classList.add("transcripcion--error");
    console.error("Error al cargar la transcripción:", error);
  } finally {
    contenedor.classList.remove("transcripcion--cargando");
  }
}

function inicializarFormulario(): void {
  const formSolicitud = document.querySelector<HTMLFormElement>("#form-solicitud");
  if (!formSolicitud) return;

  const nombre = document.querySelector<HTMLInputElement>("#nombre");
  const apellidos = document.querySelector<HTMLInputElement>("#apellidos");
  const email = document.querySelector<HTMLInputElement>("#email");
  const plato = document.querySelector<HTMLInputElement>("#plato");
  const comentarios = document.querySelector<HTMLTextAreaElement>("#comentarios");
  const contador = document.querySelector<HTMLElement>("#contador-comentarios");
  const boton = document.querySelector<HTMLButtonElement>("#btn-enviar");
  const mensajeExito = document.querySelector<HTMLElement>("#mensaje-exito");

  if (
    !nombre ||
    !apellidos ||
    !email ||
    !plato ||
    !comentarios ||
    !contador ||
    !boton ||
    !mensajeExito
  ) {
    return;
  }

  const campos: HTMLInputElement[] = [nombre, apellidos, email, plato];
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  comentarios.addEventListener("input", () => {
    contador.textContent = `${comentarios.value.length} / 300 caracteres`;
  });

  const mostrarError = (campo: HTMLInputElement, mensaje: string): void => {
    campo.classList.add("invalido");
    const errorElemento = document.getElementById(`error-${campo.id}`);

    if (errorElemento instanceof HTMLElement) {
      errorElemento.textContent = mensaje;
    }
  };

  const limpiarErrores = (): void => {
    document.querySelectorAll<HTMLElement>(".error-mensaje").forEach((el) => {
      el.textContent = "";
    });

    campos.forEach((campo) => {
      campo.classList.remove("valido", "invalido");
    });
  };

  const validarFormulario = (): void => {
    let valido = true;
    limpiarErrores();

    campos.forEach((campo) => {
      const valor = campo.value.trim();

      if (valor === "") {
        mostrarError(campo, "Este campo es obligatorio.");
        valido = false;
        return;
      }

      if (
        (campo === nombre || campo === apellidos || campo === plato) &&
        !soloLetras.test(valor)
      ) {
        mostrarError(campo, "No puede contener números ni caracteres especiales.");
        valido = false;
        return;
      }

      if (campo === email && !emailValido.test(valor)) {
        mostrarError(campo, "El correo electrónico no tiene un formato válido.");
        valido = false;
        return;
      }

      campo.classList.add("valido");
    });

    boton.disabled = !valido;
  };

  campos.forEach((campo) => {
    campo.addEventListener("input", validarFormulario);
  });

  formSolicitud.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    validarFormulario();

    if (boton.disabled) return;

    mensajeExito.classList.remove("oculto");
    formSolicitud.reset();
    boton.disabled = true;
    limpiarErrores();
    contador.textContent = "0 / 300 caracteres";
  });
}