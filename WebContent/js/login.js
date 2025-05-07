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
      headers: { 'Content-Type': 'application/json' },
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
    window.location.href = "segnalazioni.html";
  });

  document.getElementById("togglePassword").addEventListener("click", function (e) {
    e.preventDefault();
    const passwordField = document.getElementById("password");
    const isHidden = passwordField.getAttribute("type") === "password";
    passwordField.setAttribute("type", isHidden ? "text" : "password");
    this.textContent = isHidden ? "Nascondi password" : "Mostra password";
  });

  // --- Gestione Password Dimenticata ---
  const forgotLink = document.getElementById("forgotPassword");
  const modal = document.getElementById("forgotModal");
  const closeBtn = modal.querySelector(".close");
  const sendBtn = document.getElementById("sendReset");
  const resetEmailInput = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "block";
    resetMessage.textContent = "";
    resetEmailInput.value = "";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  sendBtn.addEventListener("click", function () {
    const email = resetEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      resetMessage.textContent = "Il campo email non può essere vuoto.";
      return;
    }
  
    if (!emailRegex.test(email)) {
      resetMessage.textContent = "Formato email non valido. Es: nome@dominio.com";
      return;
    }
  
    fetch('http://localhost:3000/api/send-reset-email', {      //todo
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(res => {
        if (!res.ok) throw new Error("Errore nell'invio dell'email.");
        return res.json();
      })
      .then(data => {
        resetMessage.textContent = "Email inviata! Controlla la tua casella.";
      })
      .catch(err => {
        resetMessage.textContent = err.message || "Errore durante l'invio.";
      });
  });
});
