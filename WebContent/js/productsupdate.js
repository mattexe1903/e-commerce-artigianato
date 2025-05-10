let categoriesMap = [];

window.onload = async function () {
  await caricaCategorie();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  if (!productId) return;

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) throw new Error('Errore nel caricamento del prodotto');

    const { product } = await response.json();

    document.getElementById('product-img').src = product.photo
      ? `http://localhost:3000${product.photo}`
      : 'http://localhost:3000/images/placeholder.jpg';

    document.getElementById('product-name').value = product.product_name || "";
    document.getElementById('product-description-text').value = product.photo_description || "";
    document.getElementById('product-price').value = product.price || "0.00";
    document.getElementById('product-quantity').value = product.quantity || "0";

    // Imposta la categoria selezionata
    const select = document.getElementById('product-category');
    for (let option of select.options) {
      if (option.textContent === product.category_name) {
        option.selected = true;
        break;
      }
    }

  } catch (error) {
    console.error('Errore:', error);
  }
};

async function caricaCategorie() {
  const selectCategoria = document.getElementById("product-category");
  selectCategoria.innerHTML = `<option value="">Seleziona categoria</option>`;

  try {
    const response = await fetch('http://localhost:3000/api/categories');
    const result = await response.json();

    categoriesMap = result.categories;

    result.categories.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.category_name;
      option.textContent = c.category_name;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.error("Errore nel caricamento delle categorie:", error);
  }
}

async function salvaModificheProdotto() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  const nome = document.getElementById('product-name').value.trim();
  const descrizione = document.getElementById('product-description-text').value.trim();
  const prezzoStr = document.getElementById('product-price').value.trim();
  const quantitaStr = document.getElementById('product-quantity').value.trim();
  const categoriaNome = document.getElementById('product-category').value.trim();

  const prezzo = prezzoStr !== "" ? parseFloat(prezzoStr) : NaN;
  const quantita = quantitaStr !== "" ? parseInt(quantitaStr) : NaN;

  const categoriaObj = categoriesMap.find(c => c.category_name === categoriaNome);
  const categoriaId = categoriaObj ? categoriaObj.id : null;

  // Validazione minima
  if (!nome || isNaN(prezzo) || isNaN(quantita) || !categoriaId) {
    alert("Compila correttamente tutti i campi.");
    return;
  }

  const data = {
    product_name: nome,
    photo_description: descrizione,
    price: prezzo,
    quantity: quantita,
    category_id: categoriaId
  };

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const err = await response.json();
      alert(`Errore: ${err.message || "Errore durante il salvataggio"}`);
    } else {
      alert("Prodotto aggiornato con successo!");
    }
  } catch (error) {
    console.error("Errore PUT:", error);
    alert("Errore di rete durante l'aggiornamento.");
  }
}

// Upload immagine (PATCH separato)
document.getElementById("image-upload").addEventListener("change", async function () {
  const file = this.files[0];
  const productId = new URLSearchParams(window.location.search).get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  if (!file || !productId) return;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}/photo`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("product-img").src = `http://localhost:3000${data.photo}`;
      alert("Immagine aggiornata con successo!");
    } else {
      alert("Errore durante l'aggiornamento dell'immagine.");
    }
  } catch (error) {
    console.error("Errore PATCH:", error);
    alert("Errore di rete durante l'upload.");
  }
});
