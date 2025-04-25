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

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Credenziali errate");
        }
        return response.json();
      })
      .then(data => {
        const user = data.user;

        localStorage.setItem("user", JSON.stringify(user));
        
        switch(user.ruolo) {
          case "admin":
            window.location.href = "adminview.html";
            break;
          case "cliente":
            window.location.href = "homereg.html";
            break;
          case "artigiano":
            window.location.href = "homereg.html";
            break;
          default:
            errorMessage.style.display = "block";
            errorMessage.textContent = "Ruolo non riconosciuto.";
            return;
        }
      })
      .catch(error => {
        errorMessage.style.display = "block";
        errorMessage.textContent = error.message || "Errore di connessione.";
      });

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
