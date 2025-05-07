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
    const errorMessage = document.getElementById('error-message');


    //TO DO: CONTROLLO PASSWORD E CONFERMA PASSWORD

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

      console.log("Dati artigiano:", { datiBase, datiExtra });

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


      //  INVIA A ADMIN
      /*const segnalazioneAdmin = {
        nome: datiBase.nome,
        cognome: datiBase.cognome,
        mansione: datiExtra.tipo_artigiano,
        iban: datiExtra.iban
      };
      console.log("Invia segnalazione all’admin:", segnalazioneAdmin);
*/
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

          window.location.href = "homereg.html";
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