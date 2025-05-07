window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) return;

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (!response.ok) throw new Error("Prodotto non trovato");

    const prodotto = await response.json();
    console.log(prodotto);
    
    const datiProdotto = prodotto.product;
    
    // Imposta l'immagine
    document.getElementById('product-img').src = datiProdotto.photo ? 
      `http://localhost:3000${datiProdotto.photo}` : 'http://localhost:3000/images/placeholder.jpg';
    
    // Imposta i dettagli del prodotto
    document.getElementById('product-name').innerText = datiProdotto.product_name || "Senza nome";
    document.getElementById('product-category').innerText = datiProdotto.category || "Non specificata";
    document.getElementById('product-description-text').innerText = datiProdotto.photo_description || "Nessuna descrizione disponibile";
    document.getElementById('product-price').innerText = `€${Number(datiProdotto.price).toFixed(2)}`;
    document.getElementById('product-quantity').innerText = datiProdotto.quantity || 0;
    document.getElementById('quantity-input').max = datiProdotto.quantity || 1;
    

  } catch (error) {
    console.error("Errore nel recupero del prodotto:", error);
  }
};

async function aggiungiAiPreferiti() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const heartIcon = document.getElementById('heart-icon');
  const user = JSON.parse(localStorage.getItem("user"));

  if (!prodottoId || !user) {
    document.getElementById('login-popup').style.display = 'flex';
    return;
  }

  try {
    const isPreferito = heartIcon.classList.contains('preferito');
    const method = isPreferito ? 'DELETE' : 'POST';

    const response = await fetch(`/api/utenti/preferiti/${prodottoId}`, { method });

    if (response.ok) {
      heartIcon.classList.toggle('preferito');
      heartIcon.style.color = heartIcon.classList.contains('preferito') ? 'red' : '#f5b400';
    } else if (response.status === 401) {
      document.getElementById('login-popup').style.display = 'flex';
    }
  } catch (error) {
    console.error("Errore durante l'aggiunta/rimozione dai preferiti:", error);
  }
}

async function aggiungiAlCarrello() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const quantita = parseInt(document.getElementById('quantity-input').value);
  const maxQuantita = parseInt(document.getElementById('quantity-input').max);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    document.getElementById('login-popup').style.display = 'flex';
    return;
  }

  if (!prodottoId || isNaN(quantita) || quantita < 1 || quantita > maxQuantita) return;

  try {
    const response = await fetch(`/api/carrello`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prodottoId, quantita })
    });

    if (response.ok) {
      alert("Prodotto aggiunto al carrello!");
    } else if (response.status === 401) {
      document.getElementById('login-popup').style.display = 'flex';
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
