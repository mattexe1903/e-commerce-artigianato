window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get('tipo');
  const formArtigiano = document.getElementById('form-artigiano');

  if (tipo === 'artigiano') {
    formArtigiano.style.display = 'block';
  }

  const form = document.getElementById('form-cliente');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const datiBase = {
      nome: form.nome.value.trim(),
      cognome: form.cognome.value.trim(),
      indirizzo: form.indirizzo.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      conferma: form.conferma.value.trim(),
      ruolo: 'cliente'
    };

    if (datiBase.password !== datiBase.conferma) {
      alert("Le password non coincidono.");
      return;
    }

    if (tipo === 'artigiano') {
      const datiExtra = {
        tipo_artigiano: form.tipo_artigiano.value.trim(),
        iban: form.iban.value.trim()
      };

      //  COLLEGAMENTO AL DB per ARTIGIANO
      console.log("Salva nel DB (Artigiano):", { ...datiBase, ...datiExtra });

      //  INVIA A ADMIN
      const segnalazioneAdmin = {
        nome: datiBase.nome,
        cognome: datiBase.cognome,
        mansione: datiExtra.tipo_artigiano,
        iban: datiExtra.iban
      };
      console.log("Invia segnalazione all’admin:", segnalazioneAdmin);

    } else {

      console.log("Dati inviati al backend:", datiBase);

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

          window.location.href = "homereg.html";
        })
        .catch(error => {
          errorMessage.style.display = "block";
          errorMessage.textContent = error.message || "Errore di connessione.";
        });
    }
    window.location.href = "home.html";
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