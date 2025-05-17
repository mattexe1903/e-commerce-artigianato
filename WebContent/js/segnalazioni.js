document.addEventListener('DOMContentLoaded', () => {
  const problemaSelect = document.getElementById('problema');
  const inviaBtn = document.getElementById('inviaBtn');
  const noteContainer = document.getElementById('noteContainer');
  const noteInput = document.getElementById('note');
  const emailInput = document.getElementById('email');
  const form = document.getElementById('segnalazioneForm');

  problemaSelect.addEventListener('change', () => {
    const selected = problemaSelect.value;
    if (selected) {
      inviaBtn.style.display = 'block';
      noteContainer.style.display = 'block';
    } else {
      inviaBtn.style.display = 'none';
      noteContainer.style.display = 'none';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const segnalazione = {
      email: emailInput.value.trim(),
      titolo: problemaSelect.value,
      messaggio: noteInput.value.trim(),
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
        alert("Segnalazione inviata con successo!");
        window.location.href = "../home.html";
      } else {
        alert("Errore durante l'invio. Riprova.");
      }
    })
    .catch(error => {
      console.error("Errore:", error);
      alert("Errore imprevisto. Riprova più tardi.");
    });
  });
});