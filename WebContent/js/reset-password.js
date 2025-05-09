document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('resetBtn');
  const passwordInput = document.getElementById('newPassword');
  const messageBox = document.getElementById('resetMessage');

  // Prova a recuperare il token da localStorage, altrimenti da URL
  let token = localStorage.getItem('resetToken');
  if (!token) {
    const urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get('token');
  }

  if (!token) {
    messageBox.style.color = 'orange';
    messageBox.textContent = 'Token non trovato. Impossibile reimpostare la password.';
    resetBtn.disabled = true;
    return;
  }

  resetBtn.addEventListener('click', async () => {
    const newPassword = passwordInput.value.trim();

    if (!newPassword || newPassword.length < 6) {
      messageBox.style.color = 'orange';
      messageBox.textContent = 'La password deve contenere almeno 6 caratteri.';
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();
      console.log('Risposta del server:', data);

      if (res.ok) {
        messageBox.style.color = 'lightgreen';
        messageBox.textContent = data.message || 'Password aggiornata con successo.';
        passwordInput.disabled = true;
        resetBtn.disabled = true;
        localStorage.removeItem('resetToken');

        // Reindirizza a login.html dopo 5 secondi
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 5000);
      } else {
        messageBox.style.color = 'orange';
        messageBox.textContent = data.message || 'Errore durante il reset.';
      }

    } catch (err) {
      console.error('Errore durante il reset:', err);
      messageBox.style.color = 'red';
      messageBox.textContent = 'Errore di connessione al server.';
    }
  });
});
