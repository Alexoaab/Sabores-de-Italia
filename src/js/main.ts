// Importación del archivo SCSS.
import "../scss/main.scss";
// Importación de la librería AOS
import AOS from "aos";
// Importación del CSS oficial de AOS.
import "aos/dist/aos.css";
// Importación de Swiper.
import Swiper from "swiper";
// Importación de módulos específicos.
// Navigation → Flechas siguiente/anterior
// Pagination → Puntos inferiores de navegación
import { Navigation, Pagination } from "swiper/modules";
// Importación de los estilos del carrusel.
import "swiper/swiper-bundle.css";
// Importación de librería para crear lightbox en imágenes.
import GLightbox from 'glightbox';
// Importación de sus estilos oficiales.
import 'glightbox/dist/css/glightbox.css';

// Inicialización del lightbox.
// Actúa sobre los elementos con clase .glightbox
const lightbox = GLightbox({
  selector: '.glightbox'
});

// ===============================
// DOM READY
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ANIMACIONES AOS
  // ===============================
  // Se activa la librería AOS.
  // duration: duración de animación en ms
  // once: false, la animación se repite cada vez que entra en viewport
  AOS.init({
    duration: 800,
    once: false
  });

  // ============================================================
  // CARRUSEL (SWIPER) EN INDEX.HTML
  // ============================================================

  // Se comprueba si existe el contenedor .swiper para evitar errores en páginas donde no hay carrusel.
  const swiperContainer = document.querySelector(".swiper");
  // Si existe el contenedor swiper
  if (swiperContainer) {

    // Se crea una nueva instancia del carrusel.
    new Swiper(".swiper", {

      // Se registran los módulos utilizados.
      modules: [Navigation, Pagination],

      // Número de tarjetas visibles por defecto (móvil)
      slidesPerView: 1,

      // Espacio entre tarjetas
      spaceBetween: 20,

      // Configuración de flechas de navegación
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // Configuración de paginación inferior
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      // Diseño responsive
      breakpoints: {
        768: { slidesPerView: 2 },   // Tablet
        1024: { slidesPerView: 4 },  // Desktop
      },
    });
  }

  // ============================================================
  // BOTONES MOSTRAR / OCULTAR (DETALLES RECETA)
  // ============================================================

  // Se seleccionan todos los botones que permiten mostrar u ocultar contenido dentro de las páginas de detalle.
  const botones = document.querySelectorAll<HTMLButtonElement>(".toggle-btn");

  // Se recorre cada botón encontrado en el documento.
  botones.forEach((boton) => {

    // Se busca el contenedor padre más cercano con clase .detalle-seccion.
    // closest() permite recorrer el DOM hacia arriba.
    const seccion = boton.closest<HTMLElement>(".detalle-seccion");

    // Dentro de esa sección se busca el contenido que puede ocultarse:
    // - Listas <ul>
    // - Listas <ol>
    // - O cualquier bloque con clase .presentacion-contenido
    // El operador ?. evita errores si la sección no existe.
    const contenido = seccion?.querySelector<HTMLElement>("ul, ol, .presentacion-contenido");

    // Si no existe contenido que alternar, se detiene la ejecución para ese botón concreto.
    if (!contenido) return;

    // Se ajusta el texto inicial del botón dependiendo de si el contenido está oculto o visible.
    boton.textContent = contenido.classList.contains("oculto")
      ? "Mostrar"
      : "Ocultar";

    // Se añade un evento click al botón.
    boton.addEventListener("click", () => {

      // Se alterna la clase "oculto".
      // Si está presente → se elimina.
      // Si no está presente → se añade.
      contenido.classList.toggle("oculto");

      // Se actualiza en tiempo real el texto del botón para reflejar el nuevo estado del contenido.
      boton.textContent = contenido.classList.contains("oculto")
        ? "Mostrar"
        : "Ocultar";
    });
  });

  // ============================================================
  // BOTONES MOSTRAR / OCULTAR (TRASCRIPCIÓN VIDEOS)
  // ============================================================
const botonesTranscripcion = document.querySelectorAll<HTMLButtonElement>(".toggle-btn");

botonesTranscripcion.forEach((boton) => {
  boton.addEventListener("click", () => {
    const id = boton.getAttribute("aria-controls");
    const contenido = document.getElementById(id!);

    if (!contenido) return;

    const expanded = boton.getAttribute("aria-expanded") === "true";

    boton.setAttribute("aria-expanded", String(!expanded));
    contenido.classList.toggle("oculto");

    boton.textContent = expanded
      ? "Mostrar transcripción"
      : "Ocultar transcripción";
  });
});

  // ============================================================
  // FORMULARIO DE SOLICITUD
  // ============================================================

  // Se selecciona el formulario por su ID.
  const formSolicitudElement = document.querySelector<HTMLFormElement>("#form-solicitud");

  // Si el formulario no existe (por ejemplo en otras páginas), se detiene la ejecución para evitar errores.
  if (!formSolicitudElement) return;

  // Se asegura el tipo correcto del formulario.
  const formSolicitud: HTMLFormElement = formSolicitudElement;

  // ------------------------------------------------------------
  // SELECCIÓN DE CAMPOS DEL FORMULARIO
  // ------------------------------------------------------------

  // Se seleccionan todos los inputs y elementos necesarios para la validación y control del formulario.

  const nombre = document.querySelector<HTMLInputElement>("#nombre");
  const apellidos = document.querySelector<HTMLInputElement>("#apellidos");
  const email = document.querySelector<HTMLInputElement>("#email");
  const plato = document.querySelector<HTMLInputElement>("#plato");
  const comentarios = document.querySelector<HTMLTextAreaElement>("#comentarios");
  const contador = document.querySelector<HTMLElement>("#contador-comentarios");
  const botonElement = document.querySelector<HTMLButtonElement>("#btn-enviar");
  const mensajeExito = document.querySelector<HTMLElement>("#mensaje-exito");

  // Si cualquiera de los elementos no existe, se detiene la ejecución para evitar errores en tiempo de ejecución.
  if (!nombre || !apellidos || !email || !plato || !comentarios || !contador || !botonElement || !mensajeExito) {
    return;
  }

  // Se asegura el tipo del botón de envío.
  const boton: HTMLButtonElement = botonElement;

  // Se agrupan los campos obligatorios en un array para poder recorrerlos fácilmente durante la validación.
  const campos: HTMLInputElement[] = [nombre, apellidos, email, plato];

  // ============================================================
  // CONTADOR DE CARACTERES
  // ============================================================

  comentarios.addEventListener("input", () => {
    contador.textContent = `${comentarios.value.length} / 300 caracteres`;
  });

  // ============================================================
  // VALIDACIONES DEL FORMULARIO
  // ============================================================
  // ------------------------------------------------------------
  // EXPRESIONES REGULARES
  // ------------------------------------------------------------

  // Permite únicamente letras (mayúsculas, minúsculas), caracteres acentuados y espacios.
  // Se utiliza para validar nombre, apellidos y plato.
  const soloLetras: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  // Valida el formato básico de un correo electrónico:
  // - Texto antes de @
  // - Dominio
  // - Extensión mínima de 2 caracteres
  const emailValido: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ------------------------------------------------------------
  // FUNCIÓN: mostrarError
  // ------------------------------------------------------------
  // Aplica estilo visual de error al campo y muestra el mensaje correspondiente debajo del input.
  function mostrarError(campo: HTMLInputElement, mensaje: string): void {

    // Añade clase CSS para marcar visualmente el campo como inválido
    campo.classList.add("invalido");

    // Busca el elemento <small> asociado al campo siguiendo el patrón: error-idDelCampo
    const errorElemento = document.getElementById(`error-${campo.id}`);

    // Si el elemento existe, muestra el mensaje de error
    if (errorElemento instanceof HTMLElement) {
      errorElemento.textContent = mensaje;
    }
  }

  // ------------------------------------------------------------
  // FUNCIÓN: limpiarErrores
  // ------------------------------------------------------------
  // Elimina todos los mensajes de error visibles y restablece las clases visuales de los campos.
  function limpiarErrores(): void {

    // Borra el texto de todos los mensajes de error
    document
      .querySelectorAll<HTMLElement>(".error-mensaje")
      .forEach((el) => (el.textContent = ""));

    // Elimina clases de validación en cada campo
    campos.forEach((campo) => {
      campo.classList.remove("valido", "invalido");
    });
  }

  // ------------------------------------------------------------
  // FUNCIÓN PRINCIPAL: validarFormulario
  // ------------------------------------------------------------
  // Comprueba todos los campos obligatorios y aplica:
  // - Validación de campo vacío
  // - Validación de formato
  // - Activación/desactivación del botón
  function validarFormulario(): void {

    // Variable que controla si el formulario es válido o no
    let valido: boolean = true;

    // Limpia errores previos antes de validar nuevamente
    limpiarErrores();

    // Recorre todos los campos del formulario
    campos.forEach((campo) => {

      // Elimina espacios en blanco al inicio y final
      const valor = campo.value.trim();

      // --------------------------------------------------------
      // VALIDACIÓN 1: Campo obligatorio
      // --------------------------------------------------------
      if (valor === "") {
        mostrarError(campo, "Este campo es obligatorio.");
        valido = false;
        return; // Pasa al siguiente campo
      }

      // --------------------------------------------------------
      // VALIDACIÓN 2: Solo letras (nombre, apellidos, plato)
      // --------------------------------------------------------
      if (
        (campo === nombre || campo === apellidos || campo === plato) &&
        !soloLetras.test(valor)
      ) {
        mostrarError(
          campo,
          "No puede contener números ni caracteres especiales."
        );
        valido = false;
        return; // Pasa al siguiente campo
      }

      // --------------------------------------------------------
      // VALIDACIÓN 3: Formato email
      // --------------------------------------------------------
      if (campo === email && !emailValido.test(valor)) {
        mostrarError(
          campo,
          "El correo electrónico no tiene un formato válido."
        );
        valido = false;
        return; 
      }

      // Si pasa todas las validaciones, se marca como válido
      campo.classList.add("valido");
    });

    // --------------------------------------------------------
    // ACTIVACIÓN DEL BOTÓN
    // --------------------------------------------------------
    // Si hay algún error, el botón permanece deshabilitado. Si todo es correcto, se habilita.
    boton.disabled = !valido;
  }

  // ============================================================
  // VALIDACIÓN EN TIEMPO REAL
  // ============================================================

  // Se recorre cada campo del formulario y se añade un evento "input".
  // Este evento se dispara cada vez que el usuario escribe, borra o modifica el contenido del campo.
  campos.forEach((campo) => {

    // Cada vez que el usuario introduce un carácter, se ejecuta la función validarFormulario().
    // Esto permite mostrar errores en tiempo real sin necesidad de enviar el formulario.
    campo.addEventListener("input", validarFormulario);
  });

  // ============================================================
  // ENVÍO DEL FORMULARIO
  // ============================================================

  // Se añade un listener al evento "submit" del formulario.
  // Este evento se dispara cuando el usuario pulsa el botón Enviar.
  formSolicitud.addEventListener("submit", (e: SubmitEvent) => {

    // Se previene el comportamiento por defecto del navegador, que sería enviar el formulario y recargar la página.
    e.preventDefault();

    // Se ejecuta una validación final antes de permitir el envío.
    validarFormulario();

    // Si el botón sigue deshabilitado significa que existen errores en el formulario.
    // En ese caso se cancela el proceso.
    if (boton.disabled) return;

    // Si todo es correcto: Se muestra el mensaje de éxito eliminando la clase "oculto".
    mensajeExito.classList.remove("oculto");

    // Se reinician todos los campos del formulario.
    formSolicitud.reset();

    // Se vuelve a desactivar el botón hasta que el usuario vuelva a introducir datos válidos.
    boton.disabled = true;

    // Se eliminan estilos y mensajes de validación anteriores.
    limpiarErrores();

    // Se reinicia el contador de caracteres del textarea.
    contador.textContent = "0 / 300 caracteres";
  });

});