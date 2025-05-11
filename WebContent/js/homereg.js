document.addEventListener("DOMContentLoaded", async () => {
  aggiornaCarrello();
  caricaNuoviArrivi();
  await caricaTuttiProdotti();
  caricaCategorie();
});

function vaiAllaPaginaProdotto(idProdotto) {
  const token = JSON.parse(localStorage.getItem("token"));
  window.location.href = `productsview.html?id=${idProdotto}&user=${token}`;
}

function vaiAlProfilo() {
  const token = JSON.parse(localStorage.getItem("token"));
  console.log("Token:", token);

  fetch('http://localhost:3000/api/user', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrazione fallita. Controlla i dati.");
      }

      return data;
    })
    .then(data => {
      switch (data.user_role) {
        case 1:
        case 2:
          window.location.href = "profile.html";
          break;
        case 3:
          window.location.href = "profile.html";
          break;
        default:
          errorMessage.style.display = "block";
          errorMessage.textContent = "Ruolo non riconosciuto.";
          return;
      }
    })
    .catch(error => {
      errorMessage.style.display = "block";
      errorMessage.textContent = error.message || "Errore di connessione.";
    });
}

function logout() {
  localStorage.removeItem("token");  // Rimuove il token salvato
  alert("Logout effettuato");
  window.location.href = "../home.html";  // Reindirizza alla home pubblica
}

function vaiAlCarrello() {
  const token = JSON.parse(localStorage.getItem("token"));
  window.location.href = `cart.html?user=${token}`;
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

  const prodotti = prodottiList;

  const categoriePresenti = new Set();
  prodotti.forEach(p => {
    const cat = p.category_name?.trim();
    if (cat) categoriePresenti.add(cat);
  });
  console.log("Categorie presenti nei prodotti:", Array.from(categoriePresenti));

  let filtrati = prodotti.filter(p => {
    const cat = p.category_name?.trim().toLowerCase() || '';
    const selectedCat = categoria.trim().toLowerCase();

    if (categoria && cat !== selectedCat) return false;

    if (disponibilita === "disponibile" && p.quantity <= 0) return false;
    if (disponibilita === "non_disponibile" && p.quantity > 0) return false;

    return true;
  });

  filtrati.sort((a, b) => {
    const prezzoA = parseFloat(a.price);
    const prezzoB = parseFloat(b.price);

    if (ordinePrezzo === "asc") return prezzoA - prezzoB;
    if (ordinePrezzo === "desc") return prezzoB - prezzoA;
    return 0;
  });

  lista.innerHTML = "";
  filtrati.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.prezzo = p.price ?? '';
    div.dataset.disponibile = p.quantity > 0 ? '1' : '0';
    div.dataset.categoria = p.category_name ?? '';

    div.onclick = () => vaiAllaPaginaProdotto(p.product_id);
    div.innerHTML = `
      <img src="${p.photo ? `http://localhost:3000${p.photo}` : 'http://localhost:3000/images/placeholder.jpg'}"
      alt="${p.product_id || 'Senza Nome'}"
      style="width:100px;height:auto;">
      <div class="product-name">${p.product_name || 'Nome mancante'}</div>
      <div class="product-price">€ ${Number(p.price).toFixed(2)}</div>
    `;
    lista.appendChild(div);
  });
}

async function aggiornaCarrello() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) throw new Error("Token non disponibile. Effettua il login.");

    const response = await fetch(`http://localhost:3000/api/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const resJson = await response.json();

    if (!response.ok) {
      throw new Error(resJson.message || "Errore nel recupero del carrello.");
    }

    const prodottiNelCarrello = resJson.cart;

    if (!Array.isArray(prodottiNelCarrello)) {
      throw new Error("Formato dati non valido per il carrello.");
    }

    console.log("Prodotti nel carrello:", prodottiNelCarrello);

    const totale = prodottiNelCarrello.reduce((acc, item) => {
      const prezzo = item.product?.price || item.price || 0;
      const quantita = item.quantity || 1;
      return acc + (prezzo * quantita);
    }, 0);


    document.getElementById("cart-count").innerText = `(${prodottiNelCarrello.length})`;
    document.getElementById("cart-total").innerText = `€${totale.toFixed(2)}`;

  } catch (error) {
    console.error("Errore aggiornamento carrello:", error.message || error);
  }
}

async function caricaNuoviArrivi() {
  const track = document.getElementById("carousel-track");

  if (!track) {
    console.error("Elemento carousel-track non trovato nel DOM.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/latest');

    if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

    const dati = await response.json();

    const prodotti = Array.isArray(dati.products) ? dati.products : [];

    prodotti.forEach(prodotto => {
      const div = document.createElement('div');
      div.className = 'product';
      div.onclick = () => vaiAllaPaginaProdotto(prodotto.product_id);

      div.innerHTML = `
        <img src="${prodotto.photo ? `http://localhost:3000${prodotto.photo}` : 'http://localhost:3000/images/placeholder.jpg'}"
        alt="${prodotto.product_id || 'Senza Nome'}"
        style="width:100px;height:75px;">
        <div class="product-name">${prodotto.product_name || 'Nome mancante'}</div>
        <div class="product-price">€ ${Number(prodotto.price).toFixed(2)}</div>
      `;

      track.appendChild(div);
    });

    nodes.forEach(n => {
      const clone = n.cloneNode(true);
      const id = clone.querySelector("img")?.alt;
      if (id) {
        clone.onclick = () => vaiAllaPaginaProdotto(id);
      }
      track.appendChild(clone);
    });
  } catch (error) {
    console.error('Errore nel caricare i nuovi arrivi:', error);
  }
}

let prodottiList = [];

async function caricaTuttiProdotti() {
  const lista = document.getElementById("product-list");
  lista.innerHTML = "";

  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

    const dati = await response.json();
    const arrayProdotti = Array.isArray(dati.products) ? dati.products : [];

    prodottiList = arrayProdotti;

    arrayProdotti.forEach(prodotto => {
      const div = document.createElement('div');
      div.className = 'product';
      div.dataset.prezzo = prodotto.price ?? '';
      div.dataset.disponibile = prodotto.quantity > 0 ? '1' : '0';
      div.dataset.categoria = prodotto.category_name ?? '';

      div.onclick = () => vaiAllaPaginaProdotto(prodotto.product_id);
      div.innerHTML = `
        <img src="${prodotto.photo ? `http://localhost:3000${prodotto.photo}` : 'http://localhost:3000/images/placeholder.jpg'}"
        alt="${prodotto.product_id || 'Senza Nome'}"
        style="width:100px;height:75px;">
        <div class="product-name">${prodotto.product_name || 'Nome mancante'}</div>
        <div class="product-price">€ ${Number(prodotto.price).toFixed(2)}</div>
      `;

      lista.appendChild(div);
    });
  } catch (error) {
    console.error('Errore nel caricare i prodotti:', error);
    lista.innerHTML = "<p>Errore nel caricare i prodotti.</p>";
  }
}

async function caricaCategorie() {
  const selectCategoria = document.getElementById("filtro-categoria");
  selectCategoria.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Tutte le categorie";
  selectCategoria.appendChild(defaultOption);

  try {
    const response = await fetch('http://localhost:3000/api/categories');
    if (!response.ok) throw new Error("Errore nel recupero delle categorie");

    const result = await response.json();
    const categorie = result.categories;

    categorie.forEach(c => {
      const option = document.createElement("option");
      option.value = c.category_name;
      option.textContent = c.category_name;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.error("Errore nel caricamento delle categorie:", error);
  }
}