document.addEventListener('DOMContentLoaded', () => {
  const problemaSelect = document.getElementById('problema');
  const inviaBtn = document.getElementById('inviaBtn');
  const noteContainer = document.getElementById('noteContainer');
  const noteInput = document.getElementById('note');
  const emailInput = document.getElementById('email');
  const form = document.getElementById('segnalazioneForm');

  problemaSelect.addEventListener('change', () => {
    if (problemaSelect.value) {
      inviaBtn.style.display = 'inline-block';
      noteContainer.style.display = 'block';
    } else {
      inviaBtn.style.display = 'none';
      noteContainer.style.display = 'none';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const segnalazione = {
      email: emailInput.value,
      titolo: problemaSelect.value,
      messaggio: noteInput.value || '',
      stato: 'nuova'
    };

    fetch('http://localhost:3000/api/sendSignal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(segnalazione)
    })
      .then(response => {
        if (response.ok) {
          alert("Segnalazione effettuata con successo. La preghiamo di attendere la risposta.");
          window.location.href = "../home.html";
        } else {
          alert("Errore nell'invio della segnalazione. Riprova.");
        }
      })
      .catch(error => {
        console.error("Errore durante l'invio della segnalazione:", error);
        alert("Si è verificato un errore. Riprova più tardi.");
      });
  });
});
