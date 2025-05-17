window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  // Imposta il link "Lokal"
  document.getElementById("lokal-link").href = token ? "homereg.html" : "../home.html";

  if (!productId) return;

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (!response.ok) throw new Error("Prodotto non trovato");

    const prodotto = await response.json();
    const datiProdotto = prodotto.product;

    document.getElementById('product-img').src = datiProdotto.photo
      ? `http://localhost:3000${datiProdotto.photo}`
      : 'http://localhost:3000/images/placeholder.jpg';

    document.getElementById('product-name').innerText = datiProdotto.product_name || "Senza nome";
    document.getElementById('product-category').innerText = datiProdotto.category_name || "Non specificata";
    document.getElementById('product-description-text').innerText = datiProdotto.photo_description || "Nessuna descrizione disponibile";
    document.getElementById('product-price').innerText = `€${Number(datiProdotto.price).toFixed(2)}`;
    document.getElementById('product-quantity').innerText = datiProdotto.quantity || 0;
    document.getElementById('quantity-input').max = datiProdotto.quantity || 1;

    if (token) {
      const favResponse = await fetch('http://localhost:3000/api/favourites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (favResponse.ok) {
        const result = await favResponse.json();
        const preferiti = result.data || [];

        const isPreferito = preferiti.some(p =>
          String(p.product_id) === String(productId) || String(p._id) === String(productId)
        );

        const heartIcon = document.getElementById('heart-icon');
        if (isPreferito) {
          heartIcon.classList.add('preferito');
          heartIcon.style.color = 'red';
        }
      }
    }
  } catch (error) {
    console.error("Errore nel recupero del prodotto:", error);
  }
};

function mostraPopupEReindirizza() {
  const popup = document.getElementById('login-popup');
  popup.style.display = 'flex';
}

function chiudiPopup() {
  document.getElementById('login-popup').style.display = 'none';
}

async function aggiungiAiPreferiti() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const heartIcon = document.getElementById('heart-icon');
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  if (!prodottoId || !token) {
    mostraPopupEReindirizza();
    return;
  }

  try {
    const isPreferito = heartIcon.classList.contains('preferito');
    const method = isPreferito ? 'DELETE' : 'POST';
    const endpoint = isPreferito ? '/api/removeFromFavourites' : '/api/addToFavourites';

    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: prodottoId })
    });

    if (response.ok) {
      heartIcon.classList.toggle('preferito');
      heartIcon.style.color = heartIcon.classList.contains('preferito') ? 'red' : '#f5b400';
    } else {
      const errorData = await response.json();
      alert(`Errore: ${errorData.message || 'Operazione fallita.'}`);
    }
  } catch (error) {
    console.error("Errore durante l'aggiunta/rimozione dai preferiti:", error);
  }
}

async function aggiungiAlCarrello() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const quantita = parseInt(document.getElementById('quantity-input').value);
  const maxQuantita = parseInt(document.getElementById('quantity-input').max);
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw && tokenRaw !== "null" ? JSON.parse(tokenRaw) : null;

  if (!token) {
    mostraPopupEReindirizza();
    return;
  }

  if (!prodottoId || isNaN(quantita) || quantita < 1 || quantita > maxQuantita) {
    alert("Quantità non valida.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/cart/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: prodottoId, quantity: quantita })
    });

    if (response.ok) {
      alert("Prodotto aggiunto al carrello!");
    } else {
      const errData = await response.json();
      alert(`Errore: ${errData.message || 'Impossibile aggiungere al carrello.'}`);
    }
  } catch (error) {
    console.error("Errore durante l'aggiunta al carrello:", error);
  }
}

function verificaQuantita() {
  const input = document.getElementById('quantity-input');
  const max = parseInt(input.max);
  const val = parseInt(input.value);

  if (val > max) {
    alert("La quantità selezionata supera quella disponibile.");
    input.value = max;
  } else if (val < 1 || isNaN(val)) {
    input.value = 1;
  }
}