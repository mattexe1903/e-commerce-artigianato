document.addEventListener('DOMContentLoaded', () => {
    const problemaSelect = document.getElementById('problema');
    const inviaBtn = document.getElementById('inviaBtn');
    const noteContainer = document.getElementById('noteContainer');
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
      alert("Segnalazione effettuata con successo. La preghiamo di attendere la risposta.");
      window.location.href = "../home.html";
    });
  });
  