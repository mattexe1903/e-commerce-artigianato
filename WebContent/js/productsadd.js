// Anteprima immagine
document.getElementById("image-upload").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("product-img").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Invio del prodotto al database
  function creaProdotto() {
    const nome = document.getElementById("product-name").value;
    const categoria = document.getElementById("product-category").value;
    const descrizione = document.getElementById("product-description-text").value;
    const prezzo = parseFloat(document.getElementById("product-price").value);
    const quantita = parseInt(document.getElementById("product-quantity").value);
    const immagine = document.getElementById("product-img").src;
    const dataCreazione = new Date().toISOString();
    const utenteId = localStorage.getItem("utenteId"); // Assumendo che l'ID utente sia salvato nel localStorage
  
    const prodotto = {
      nome,
      categoria,
      descrizione,
      prezzo,
      quantita,
      immagine,
      dataCreazione,
      utenteId
    };
  
    fetch('/api/prodotti', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prodotto)
    })
    .then(res => {
      if (!res.ok) throw new Error("Errore nella creazione del prodotto");
      return res.json();
    })
    .then(data => {
      alert("Prodotto creato con successo!");
      // Redirect o reset del form
      window.location.href = "profilearti.html";
    })
    .catch(err => {
      console.error(err);
      alert("Errore durante la creazione del prodotto");
    });
  }
  