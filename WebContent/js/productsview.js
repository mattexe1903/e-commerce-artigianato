window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId) {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}`);
      if (!response.ok) throw new Error("Prodotto non trovato");
      const data = await response.json();
      const prodotto = data.product;

      document.getElementById('product-img').src = prodotto.photo;
      document.getElementById('product-name').innerText = prodotto.product_name;
      document.getElementById('product-category').innerText = prodotto.category || "N/A";
      document.getElementById('product-description-text').innerText = prodotto.photo_description || "N/A";
      document.getElementById('product-price').innerText = `€${Number(prodotto.price).toFixed(2)}`;
      document.getElementById('product-quantity').innerText = prodotto.quantity;
      document.getElementById('quantity-input').max = prodotto.quantity;

    } catch (error) {
      console.error("Errore nel recupero del prodotto:", error);
    }
  }
};

async function aggiungiAiPreferiti() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const heartIcon = document.getElementById('heart-icon');

  if (!prodottoId) return;

  try {
    const isPreferito = heartIcon.classList.contains('preferito');
    const method = isPreferito ? 'DELETE' : 'POST';

    const response = await fetch(`/api/utenti/preferiti/${prodottoId}`, {
      method: method
    });

    if (response.ok) {
      if (isPreferito) {
        heartIcon.classList.remove('preferito');
        heartIcon.style.color = '#f5b400';
        console.log(`Prodotto ${prodottoId} rimosso dai preferiti.`);
      } else {
        heartIcon.classList.add('preferito');
        heartIcon.style.color = 'red';
        console.log(`Prodotto ${prodottoId} aggiunto ai preferiti!`);
      }
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

  if (!prodottoId || !quantita || quantita < 1 || quantita > maxQuantita) return;

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
  } else if (val < 1) {
    input.value = 1;
  }
}
