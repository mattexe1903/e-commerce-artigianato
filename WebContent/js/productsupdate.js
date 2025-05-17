let categoriesMap = [];
let prodottoOriginale = {};

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  await caricaCategorie();

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

    const categoriaSelect = document.getElementById('product-category');
    const categoryIdStr = String(product.category_id);

    if ([...categoriaSelect.options].some(opt => opt.value === categoryIdStr)) {
      categoriaSelect.value = categoryIdStr;
    }

    prodottoOriginale = {
      product_name: product.product_name || "",
      photo_description: product.photo_description || "",
      price: parseFloat(product.price) || 0,
      quantity: parseInt(product.quantity) || 0,
      category_id: product.category_id
    };

  } catch (error) {
    console.error('❌ Errore nel caricamento del prodotto:', error);
  }
};

async function caricaCategorie() {
  const selectCategoria = document.getElementById("product-category");
  selectCategoria.innerHTML = `<option value="" disabled selected>Seleziona categoria</option>`;

  try {
    const response = await fetch('http://localhost:3000/api/categories-info');
    const result = await response.json();

    categoriesMap = result.categories;

    result.categories.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.category_id; // campo corretto
      option.textContent = c.category_name;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.error("❌ Errore nel caricamento delle categorie:", error);
  }
}

async function salvaModificheProdotto() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  const nome = document.getElementById('product-name').value.trim();
  const descrizione = document.getElementById('product-description-text').value.trim();
  const prezzo = parseFloat(document.getElementById('product-price').value.trim());
  const quantita = parseInt(document.getElementById('product-quantity').value.trim());
  const categoriaId = Number(document.getElementById('product-category').value);

  if (!nome || isNaN(prezzo) || isNaN(quantita) || isNaN(categoriaId) || categoriaId <= 0) {
    alert("⚠️ Compila correttamente tutti i campi, inclusa la categoria.");
    return;
  }

  const modifiche = {
    product_name: nome,
    photo_description: descrizione,
    price: prezzo,
    quantity: quantita,
    category_id: categoriaId
  };

  const modificheUguali =
    modifiche.product_name === prodottoOriginale.product_name &&
    modifiche.photo_description === prodottoOriginale.photo_description &&
    modifiche.price === prodottoOriginale.price &&
    modifiche.quantity === prodottoOriginale.quantity &&
    modifiche.category_id === prodottoOriginale.category_id;

  if (modificheUguali) {
    alert("ℹ️ Nessuna modifica da salvare.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(modifiche)
    });

    if (!response.ok) {
      const err = await response.json();
      alert(`Errore: ${err.message || "Errore durante il salvataggio"}`);
    } else {
      alert("✅ Prodotto aggiornato con successo!");
      prodottoOriginale = { ...modifiche };
    }
  } catch (error) {
    console.error("❌ Errore durante la richiesta PUT:", error);
    alert("Errore di rete durante l'aggiornamento.");
  }
}

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
      alert("✅ Immagine aggiornata con successo!");
      location.reload();
    } else {
      alert("❌ Errore durante l'aggiornamento dell'immagine.");
    }
  } catch (error) {
    console.error("❌ Errore PATCH:", error);
    alert("Errore di rete durante l'upload.");
  }
});

async function eliminaProdotto() {
  const conferma = confirm("Sei sicuro di voler eliminare questo prodotto?");
  if (!conferma) return;

  const productId = new URLSearchParams(window.location.search).get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (response.ok) {
      alert("🗑️ Prodotto eliminato con successo.");
      window.location.href = "profile.html";
    } else {
      const error = await response.json();
      alert("Errore durante l'eliminazione: " + (error.message || "Errore sconosciuto."));
    }
  } catch (error) {
    console.error("❌ Errore DELETE:", error);
    alert("Errore di rete durante l'eliminazione.");
  }
}