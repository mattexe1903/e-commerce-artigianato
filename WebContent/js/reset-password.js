document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('resetBtn');
  const passwordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const messageBox = document.getElementById('resetMessage');

  // Mostra/Nascondi password
  document.getElementById("togglePassword").addEventListener("click", function (e) {
    e.preventDefault();
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    confirmPasswordInput.type = isHidden ? "text" : "password";
    this.textContent = isHidden ? "Nascondi password" : "Mostra password";
  });

  // Recupero token
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
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!newPassword || newPassword.length < 6) {
      messageBox.style.color = 'orange';
      messageBox.textContent = 'La password deve contenere almeno 6 caratteri.';
      return;
    }

    if (newPassword !== confirmPassword) {
      messageBox.style.color = 'orange';
      messageBox.textContent = 'Le password non coincidono.';
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
        confirmPasswordInput.disabled = true;
        resetBtn.disabled = true;
        localStorage.removeItem('resetToken');

        // Reindirizzamento al login dopo 5 secondi
        setTimeout(() => {
          window.location.href = 'html/login.html';
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
