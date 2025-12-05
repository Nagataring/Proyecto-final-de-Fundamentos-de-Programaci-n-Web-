// Validación del login con microinteracción
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const mensaje = document.getElementById("mensaje");

  if (usuario === "cenfo" && clave === "123") {
    mensaje.style.color = "green";
    mensaje.textContent = "Acceso correcto ✔ Redirigiendo...";
    setTimeout(() => {
      window.location.href = "landing.html"; // Redirige a landing
    }, 1500);
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "NOOP no es el usuario";
  }
});
