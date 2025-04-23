window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId) {
    const prodotto = getProdottoById(productId);
    if (prodotto) {
      document.getElementById('product-img').src = prodotto.imgUrl;
      document.getElementById('product-name').innerText = prodotto.nome;
      document.getElementById('product-category').innerText = prodotto.categoria;
      document.getElementById('product-description-text').innerText = prodotto.descrizione;
      document.getElementById('product-price').innerText = `€${prodotto.prezzo}`;
      document.getElementById('product-quantity').innerText = prodotto.quantita;
      document.getElementById('quantity-input').max = prodotto.quantita;

      // Se il prodotto è nei preferiti (da sessionStorage), colora il cuore
      const heartIcon = document.getElementById('heart-icon');
      if (sessionStorage.getItem("preferito") === "true" &&
          sessionStorage.getItem("nomeProdotto") === prodotto.nome) {
        heartIcon.classList.add('preferito');
        heartIcon.style.color = 'red';
      }
    }
  }
};

// Simulazione utente loggato
const utenteLoggato = true;

// Simulazione database prodotti
function getProdottoById(id) {
  const prodotti = [
    {
      id: 1,
      nome: "Prodotto 1",
      imgUrl: "../images/prodotto1.jpg",
      descrizione: "Descrizione dettagliata del prodotto 1.",
      categoria: "Legno",
      prezzo: "19.99",
      quantita: 20,
    },
    {
      id: 2,
      nome: "Prodotto 2",
      imgUrl: "../images/prodotto2.jpg",
      descrizione: "Descrizione dettagliata del prodotto 2.",
      categoria: "Vetro",
      prezzo: "24.99",
      quantita: 15,
    }
  ];
  return prodotti.find(p => p.id === parseInt(id));
}

// Aggiungi/Rimuovi dai preferiti
function aggiungiAiPreferiti() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const heartIcon = document.getElementById('heart-icon');

  if (!prodottoId) return;

  if (utenteLoggato) {
    const isPreferito = heartIcon.classList.contains('preferito');

    if (isPreferito) {
      heartIcon.classList.remove('preferito');
      heartIcon.style.color = '#f5b400';
      sessionStorage.setItem("preferito", "false");
      console.log(`Prodotto ${prodottoId} rimosso dai preferiti.`);
    } else {
      heartIcon.classList.add('preferito');
      heartIcon.style.color = 'red';
      sessionStorage.setItem("preferito", "true");
      console.log(`Prodotto ${prodottoId} aggiunto ai preferiti!`);
    }
  } else {
    document.getElementById('login-popup').style.display = 'flex';
  }
}

// Aggiungi al carrello
function aggiungiAlCarrello() {
  const prodottoId = new URLSearchParams(window.location.search).get('id');
  const quantita = parseInt(document.getElementById('quantity-input').value);
  const maxQuantita = parseInt(document.getElementById('quantity-input').max);

  if (!prodottoId || !quantita || quantita < 1 || quantita > maxQuantita) return;

  if (utenteLoggato) {
    console.log(`Prodotto ${prodottoId} aggiunto al carrello con quantità ${quantita}.`);
    alert("Prodotto aggiunto al carrello!");
  } else {
    document.getElementById('login-popup').style.display = 'flex';
  }
}

// Verifica quantità inserita
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
