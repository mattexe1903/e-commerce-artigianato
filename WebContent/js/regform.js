window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo'); // 'cliente' o 'artigiano'
  
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
        conferma: form.conferma.value.trim()
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
  
        // 🔗 COLLEGAMENTO AL DB per ARTIGIANO
        console.log("Salva nel DB (Artigiano):", { ...datiBase, ...datiExtra });
  
        // 📬 INVIA A ADMIN
        const segnalazioneAdmin = {
          nome: datiBase.nome,
          cognome: datiBase.cognome,
          mansione: datiExtra.tipo_artigiano,
          iban: datiExtra.iban
        };
        console.log("Invia segnalazione all’admin:", segnalazioneAdmin);
  
      } else {
        // 🔗 COLLEGAMENTO AL DB per CLIENTE
        console.log("Salva nel DB (Cliente):", datiBase);
      }
  
      // ✅ REDIRECT ALLA HOME
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
  