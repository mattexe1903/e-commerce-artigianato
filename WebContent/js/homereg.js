document.addEventListener("DOMContentLoaded", () => {
  aggiornaCarrello();
  caricaNuoviArrivi();
  caricaTuttiProdotti();
});

function getUserId() {
  return new URLSearchParams(window.location.search).get("id") || "123";
}

function vaiAllaPaginaProdotto(idProdotto) {
  const userId = getUserId();
  window.location.href = `productsview.html?id=${idProdotto}&user=${userId}`;
}

function vaiAlProfilo() {
  const userString = localStorage.getItem("user");

  if (!userString) {
    console.error("Nessun utente trovato nel localStorage");
    return;
  }

  const user = JSON.parse(userString);

  if (user.ruolo === "cliente") {
    window.location.href = "profileclient.html";
  } else if (user.ruolo === "artigiano") {
    window.location.href = "profilearti.html";
  } else {
    console.error("Ruolo non riconosciuto:", user.ruolo);
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
}

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
  try {
    const res = await fetch('/api/products/new');
    const nuoviProdotti = await res.json();

    const track = document.getElementById("carousel-track");
    track.innerHTML = "";

    nuoviProdotti.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.onclick = () => vaiAllaPaginaProdotto(p.id);
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div>${p.name}</div>
        <div>€${p.price.toFixed(2)}</div>
      `;
      track.appendChild(div);
    });

    // Duplica per effetto carousel
    track.innerHTML += track.innerHTML;
  } catch (err) {
    console.error("Errore nel caricamento dei nuovi arrivi:", err);
  }
}

async function caricaTuttiProdotti() {
  try {
    const res = await fetch('/api/products');
    const prodotti = await res.json();

    const lista = document.getElementById("product-list");
    lista.innerHTML = "";

    prodotti.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.dataset.id = p.id;
      div.dataset.prezzo = p.price;
      div.dataset.disponibile = p.available ? "1" : "0";
      div.dataset.categoria = p.category;
      div.onclick = () => vaiAllaPaginaProdotto(p.id);
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div>${p.name}</div>
        <div>€${p.price.toFixed(2)}</div>
      `;
      lista.appendChild(div);
    });
  } catch (err) {
    console.error("Errore nel caricamento dei prodotti:", err);
  }
}
