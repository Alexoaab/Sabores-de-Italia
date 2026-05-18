import "../scss/base.scss";
import "../scss/formulario.scss";
import AOS from "aos";
import "aos/dist/aos.css";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("[data-aos]")) {
    AOS.init({
      duration: 800,
      once: false
    });
  }

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

  if (!nombre || !apellidos || !email || !plato || !comentarios || !contador || !boton || !mensajeExito) {
    return;
  }

  const campos: HTMLInputElement[] = [nombre, apellidos, email, plato];
  const soloLetras: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailValido: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  comentarios.addEventListener("input", () => {
    contador.textContent = `${comentarios.value.length} / 300 caracteres`;
  });

  function mostrarError(campo: HTMLInputElement, mensaje: string): void {
    campo.classList.add("invalido");
    const errorElemento = document.getElementById(`error-${campo.id}`);
    if (errorElemento instanceof HTMLElement) {
      errorElemento.textContent = mensaje;
    }
  }

  function limpiarErrores(): void {
    document.querySelectorAll<HTMLElement>(".error-mensaje").forEach((el) => {
      el.textContent = "";
    });

    campos.forEach((campo) => {
      campo.classList.remove("valido", "invalido");
    });
  }

  function validarFormulario(): void {
    let valido = true;
    limpiarErrores();

    campos.forEach((campo) => {
      const valor = campo.value.trim();

      if (valor === "") {
        mostrarError(campo, "Este campo es obligatorio.");
        valido = false;
        return;
      }

      if ((campo === nombre || campo === apellidos || campo === plato) && !soloLetras.test(valor)) {
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
  }

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
});