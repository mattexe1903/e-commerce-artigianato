document.addEventListener("DOMContentLoaded", () => {
  aggiornaCarrello();
  caricaNuoviArrivi();
  caricaTuttiProdotti();
});

function getUserId() {
  return new URLSearchParams(window.location.search).get("id");
}

function vaiAllaPaginaProdotto(idProdotto) {
  const userId = getUserId();
  window.location.href = `productsview.html?id=${idProdotto}&user=${userId}`;
}

function vaiAlProfilo() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.id) {
    window.location.href = "profile.html";
  } else {
    alert("Devi essere autenticato per accedere al profilo.");
    window.location.href = "login.html"; // oppure home.html
  }
}
function logout() {
  alert("Logout effettuato");
  window.location.href = "../home.html";
}

function vaiAlCarrello() {
  const userId = getUserId();
  window.location.href = `cart.html?user=${userId}`;
}

function toggleAccountMenu() {
  const menu = document.getElementById("account-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleFiltri() {
  const menu = document.getElementById("menu-filtri");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function applicaFiltri() {
  const categoria = document.getElementById("filtro-categoria").value;
  const ordinePrezzo = document.getElementById("filtro-prezzo").value;
  const disponibilita = document.getElementById("filtro-disponibilita").value;

  const lista = document.getElementById("product-list");
  const prodotti = Array.from(lista.getElementsByClassName("product"));

  let filtrati = prodotti.filter(p => {
    if (categoria && p.dataset.categoria !== categoria) return false;
    return true;
  });

  filtrati.sort((a, b) => {
    if (ordinePrezzo === "asc") return parseFloat(a.dataset.prezzo) - parseFloat(b.dataset.prezzo);
    if (ordinePrezzo === "desc") return parseFloat(b.dataset.prezzo) - parseFloat(a.dataset.prezzo);
    if (disponibilita === "disponibile") return parseInt(b.dataset.disponibile) - parseInt(a.dataset.disponibile);
    if (disponibilita === "non_disponibile") return parseInt(a.dataset.disponibile) - parseInt(b.dataset.disponibile);
    return 0;
  });
  lista.innerHTML = "";
  filtrati.forEach(p => lista.appendChild(p));
};

async function aggiornaCarrello() {
  try {
    const userId = getUserId();
    const res = await fetch(`/api/cart/${userId}`);
    const prodottiNelCarrello = await res.json();

    const totale = prodottiNelCarrello.reduce((acc, p) => acc + p.price, 0);
    document.getElementById("cart-count").innerText = `(${prodottiNelCarrello.length})`;
    document.getElementById("cart-total").innerText = `€${totale.toFixed(2)}`;
  } catch (err) {
    console.error("Errore aggiornamento carrello:", err);
  }
}

async function caricaNuoviArrivi() {
  const track = document.getElementById("carousel-track");

  try {
    const response = await fetch('http://localhost:3000/api/nuovi-arrivi'); // Cambia l'endpoint se diverso
    const prodotti = await response.json();

    prodotti.forEach(prodotto => {
      const div = document.createElement('div');
      div.className = 'product';
      div.onclick = () => vaiAllaPaginaProdotto(prodotto.id);
      div.innerHTML = `
      <img src="${prodotto.immagine}" alt="${prodotto.nome}">
      <div>${prodotto.nome}</div>
      <div>€${prodotto.prezzo.toFixed(2)}</div>
    `;
      track.appendChild(div);
    });
    // Duplica il contenuto per effetto carousel infinito
    track.innerHTML += track.innerHTML;
  } catch (error) {
    console.error('Errore nel caricare i nuovi arrivi:', error);
  }
}

async function caricaTuttiProdotti() {
  const lista = document.getElementById("product-list");
  lista.innerHTML = ""; // Pulisce prima la lista

  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    const dati = await response.json();
    const arrayProdotti = Array.isArray(dati.products) ? dati.products : [];

    arrayProdotti.forEach(prodotto => {
      const div = document.createElement('div');
      div.className = 'product';
      div.dataset.prezzo = prodotto.prezzo ?? '';
      div.dataset.disponibile = prodotto.quantita > 0 ? '1' : '0';
      div.dataset.categoria = prodotto.categoria ?? '';
      div.onclick = () => vaiAllaPaginaProdotto(prodotto.id);

      div.innerHTML = `
        <img src="${prodotto.foto || 'placeholder.jpg'}" alt="${prodotto.nome || 'Senza Nome'}" style="width:100px;height:auto;">
        <div class="product-name">${prodotto.nome || 'Nome mancante'}</div>
        <div class="product-price">€ ${Number(prodotto.prezzo).toFixed(2)}</div>
      `;

      lista.appendChild(div);
    });

  } catch (error) {
    console.error('Errore nel caricare i prodotti:', error);
    lista.innerHTML = "<p>Errore nel caricare i prodotti.</p>";
  }
}
 