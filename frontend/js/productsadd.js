  async function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
  }

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const tokenRaw = localStorage.getItem("token");
const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

let utenteId = null;

if (token) {
  fetch('http://localhost:3000/api/user', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Autenticazione fallita.");
      }

      utenteId = data.user_id;
      consol
    })
    .catch(error => {
});
}


// Carica categorie all'avvio
window.onload = () => {
  caricaCategorie();
};

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

// Funzione per caricare categorie nel select
async function caricaCategorie() {
  const selectCategoria = document.getElementById("product-category");
  selectCategoria.innerHTML = `<option value="" disabled selected>Seleziona categoria</option>`;

  try {
    const response = await fetch('http://localhost:3000/api/categories-info');
    const result = await response.json();

    result.categories.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.category_id;
      option.textContent = c.category_name;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
}
}

// Invio del prodotto al database
function creaProdotto() {
  const nome = document.getElementById("product-name").value.trim();
  const descrizione = document.getElementById("product-description-text").value.trim();
  const prezzo = parseFloat(document.getElementById("product-price").value.trim());
  const quantita = parseInt(document.getElementById("product-quantity").value.trim());
  const categoriaId = document.getElementById("product-category").value;
  const file = document.getElementById("image-upload").files[0];

  if (!nome || !descrizione || isNaN(prezzo) || isNaN(quantita) || !file || !categoriaId) {
    showToast("Compila tutti i campi, inclusa la categoria, e seleziona un'immagine.");
    return;
  }

  const formData = new FormData();
  formData.append("product_name", nome);
  formData.append("photo_description", descrizione);
  formData.append("price", prezzo);
  formData.append("quantity", quantita);
  formData.append("category_id", categoriaId);
  formData.append("photo", file);
  formData.append("user_id", utenteId);

  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Errore nella creazione del prodotto");
      return res.json();
    })
    .then(data => {
      showToast("Prodotto creato con successo!");
      setTimeout(() => {
      window.location.href = "profile.html";
  }, 1500);
    })
    .catch(err => {
showToast("Errore durante la creazione del prodotto");
    });
}
