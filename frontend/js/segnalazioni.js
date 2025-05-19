async function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => t.style.display = "none", 3000);
}

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
          showToast("Segnalazione inviata con successo!");
          setTimeout(() => {
            window.location.href = "../home.html";
          }, 1500);
        } else {
          showToast("Errore durante l'invio. Riprova.");
        }
      })
      .catch(error => {
showToast("Errore imprevisto. Riprova più tardi.");
      });
  });
});
