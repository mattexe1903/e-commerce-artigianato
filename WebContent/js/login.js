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
      .then(async response => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registrazione fallita. Controlla i dati.");
        }

        return data;
      })
      .then(data => {
        const user = data.user;

        //console.log('token:', data.token);

        localStorage.setItem("token", JSON.stringify(data.token));

        //console.log("user role", user.user_role);

        switch (user.user_role) {
          case 1:
            window.location.href = "adminview.html";
            break;
          case 2:
            window.location.href = "homereg.html";
            break;
          case 3:
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
