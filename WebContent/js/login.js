document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Per favore inserisci email e password.";
      return;
    }

    // Controllo accesso admin
    if (email === "admin@admin.it" && password === "admin") {
      window.location.href = "adminview.html";
      return;
    }

    // Punto di collegamento con il database
    // Qui andrai a verificare le credenziali tramite una chiamata al server
    // Esempio (da implementare):
    // fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })

    // Simulazione temporanea per utente
    if ((email === "client@demo.it" && password === "client") || (email === "arti@demo.it" && password === "arti")) {
      localStorage.setItem("userEmail", email); // Salva l'email nel localStorage
      window.location.href = "homereg.html";  
    } else {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Credenziali errate. Riprova.";
  }

  });

  document.getElementById("registerLink").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "regchoice.html";
  });

  document.getElementById("supportLink").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "segnalazioni.html"; // Da creare
  });

  document.getElementById("togglePassword").addEventListener("click", function (e) {
    e.preventDefault();
    const passwordField = document.getElementById("password");
    const isHidden = passwordField.getAttribute("type") === "password";

    passwordField.setAttribute("type", isHidden ? "text" : "password");
    this.textContent = isHidden ? "Nascondi password" : "Mostra password";
  });
});
