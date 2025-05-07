// Recupera l'utente dal localStorage
const userString = localStorage.getItem("user");
const user = JSON.parse(userString);
const utenteId = user.id;

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
  const descrizione = document.getElementById("product-description-text").value;
  const prezzo = parseFloat(document.getElementById("product-price").value);
  const quantita = parseInt(document.getElementById("product-quantity").value);
  const file = document.getElementById("image-upload").files[0];

  if (!nome || !descrizione || isNaN(prezzo) || isNaN(quantita) || !file) {
    alert("Compila tutti i campi e seleziona un'immagine.");
    return;
  }

  const formData = new FormData();
  formData.append("product_name", nome);
  formData.append("photo_description", descrizione);
  formData.append("price", prezzo);
  formData.append("quantity", quantita);
  formData.append("photo", file);

  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (!res.ok) throw new Error("Errore nella creazione del prodotto");
    return res.json();
  })
  .then(data => {
    alert("Prodotto creato con successo!");
    window.location.href = "profilearti.html";
  })
  .catch(err => {
    console.error(err);
    alert("Errore durante la creazione del prodotto");
  });
}
