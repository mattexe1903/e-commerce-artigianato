window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get('tipo');
  const formArtigiano = document.getElementById('form-artigiano');

  if (tipo === 'artigiano') {
    formArtigiano.style.display = 'block';

    document.getElementById('iban').setAttribute('required', 'required');
    document.getElementById('tipo_artigiano').setAttribute('required', 'required');
  } else {
    document.getElementById('iban').removeAttribute('required');
    document.getElementById('tipo_artigiano').removeAttribute('required');
  }

  const form = document.getElementById('form-cliente');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("conferma");
    const errorDiv = document.getElementById("password-error");
    const errorMessage = document.getElementById('error-message');

    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    errorDiv.innerText = "";
    errorDiv.style.color = "red";
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/;

    if (!passwordRegex.test(password)) {
      errorDiv.innerText =
        "La password deve avere almeno 8 caratteri, una lettera maiuscola, un numero e nessuno spazio.";
      return;
    }

    if (password !== confirmPassword) {
      errorDiv.innerText = "Le password non corrispondono.";
      return;
    }
    errorDiv.style.color = "green";
    errorDiv.innerText = "Password valida!";

    const datiBase = {
      nome: form.nome.value.trim(),
      cognome: form.cognome.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      conferma: form.conferma.value.trim()
    };

    if (tipo === 'artigiano') {
      const datiExtra = {
        tipo_artigiano: form.tipo_artigiano.value.trim(),
        iban: form.iban.value.trim()
      };

      fetch('http://localhost:3000/api/registerArtigiano', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ datiBase, datiExtra })
      })
        .then(async response => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registrazione fallita. Controlla i dati.");
          }
          return data;
        })
        .catch(error => {
          alert(error.message || "Errore di connessione.");
          window.location.href = "login.html";
        });
      alert("Email inoltrara con successo. Attendere l'approvazione dell'amministratore.");
      window.location.href = "../home.html";
    } else {

      console.log("Dati cliente:", datiBase);

      fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datiBase)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Registrazione fallita. Controlla i dati.");
          }
          return response.json();
        })
        .then(data => {
          const user = data.user;

          localStorage.setItem("user", JSON.stringify(user));

          window.location.href = "login.html";
        })
        .catch(error => {
          errorMessage.style.display = "block";
          errorMessage.textContent = error.message || "Errore di connessione.";
        });
    }
  });
};

function togglePasswordVisibility(fieldId, link) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
    link.textContent = "Nascondi password";
  } else {
    field.type = "password";
    link.textContent = "Mostra password";
  }
}