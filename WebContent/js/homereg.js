const userId = 42; // Simulazione: l'ID utente può essere recuperato da sessione/cookie

function vaiAllaPaginaProdotto(idProdotto) {
  window.location.href = `productsview.html?id=${idProdotto}&user=${userId}`;
}

function vaiAlProfiloFromStorage() {
  const email = localStorage.getItem("userEmail");
  if (email) {
    fetch('http://localhost:3000/api/getRuolo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })    
    .then(response => {
      if (!response.ok) {
        throw new Error("Errore nel recupero del ruolo");
      }
      return response.json();
    })
    .then(data => {
      vaiAlProfiloConRuolo(data.ruolo);
    })
    .catch(err => {
      console.error("Errore nel recupero ruolo:", err);
    });
  } else {
    console.error("Email utente non trovata nel localStorage.");
  }
}

function vaiAlProfiloConRuolo(ruolo) {
  if (ruolo === "cliente") {
    window.location.href = "profileclient.html";
  } else if (ruolo === "artigiano") {
    window.location.href = "profilearti.html";
  } else {
    console.error("Ruolo non riconosciuto:", ruolo);
  }
}


function logout() {
  alert("Logout effettuato");
  window.location.href = "../home.html";
}

function vaiAlCarrello() {
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

// Duplica carousel
window.addEventListener("load", () => {
  const track = document.getElementById("carousel-track");
  const prodotti = track.innerHTML;
  track.innerHTML += prodotti;

  // Simulazione: aggiorna il carrello
  aggiornaCarrello();
});

function aggiornaCarrello() {
  // Simulazione dati del carrello
  const prodottiNelCarrello = [
    { nome: "Prodotto A", prezzo: 19.99 },
    { nome: "Prodotto B", prezzo: 24.50 }
  ];

  const totale = prodottiNelCarrello.reduce((acc, p) => acc + p.prezzo, 0);
  document.getElementById("cart-count").innerText = `(${prodottiNelCarrello.length})`;
  document.getElementById("cart-total").innerText = `€${totale.toFixed(2)}`;
}
