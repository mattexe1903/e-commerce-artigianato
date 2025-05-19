function vaiAllaPaginaProdotto(idProdotto) {
    window.location.href = `html/productsview.html?id=${idProdotto}`;
}

function toggleFiltri() {
    const menu = document.getElementById("menu-filtri");
    menu.style.display = menu.style.display === "none" ? "block" : "none";
}

let prodottiList = [];

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
        alt="${prodotto.product_id || 'Senza Nome'}">
        <div class="product-name">${prodotto.product_name || 'Nome mancante'}</div>
        <div class="product-price">€ ${Number(prodotto.price).toFixed(2)}</div>
      `;

      console.log('Aggiunto prodotto:', prodotto.product_name);
      track.appendChild(div);
    });

  } catch (error) {
    console.error('Errore nel caricare i nuovi arrivi:', error);
  }
}

async function caricaTuttiProdotti() {
    const lista = document.getElementById("product-list");
    lista.innerHTML = "";

    try {
        const response = await fetch('http://localhost:3000/api/products');
        const dati = await response.json();
        const arrayProdotti = Array.isArray(dati.products) ? dati.products : [];

        prodottiList = arrayProdotti;

        arrayProdotti.forEach(prodotto => {
            const div = creaElementoProdotto(prodotto);
            lista.appendChild(div);
        });
    } catch (error) {
        console.error('Errore nel caricare i prodotti:', error);
        lista.innerHTML = "<p>Errore nel caricare i prodotti.</p>";
    }
}

function creaElementoProdotto(prodotto) {
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.prezzo = prodotto.price ?? '';
    div.dataset.disponibile = prodotto.quantity > 0 ? '1' : '0';
    div.dataset.categoria = prodotto.category_name ?? '';
    div.onclick = () => vaiAllaPaginaProdotto(prodotto.product_id);

    div.innerHTML = `
    <img src="${prodotto.photo ? `http://localhost:3000${prodotto.photo}` : 'http://localhost:3000/images/placeholder.jpg'}"
      alt="${prodotto.product_id || 'Senza Nome'}">
    <div class="product-name">${prodotto.product_name || 'Nome mancante'}</div>
    <div class="product-price">€ ${Number(prodotto.price).toFixed(2)}</div>
  `;

    return div;
}

function applicaFiltri() {
  const categoria = document.getElementById("filtro-categoria").value;
  const ordinePrezzo = document.getElementById("filtro-prezzo").value;
  const disponibilita = document.getElementById("filtro-disponibilita").value;
 
  const lista = document.getElementById("product-list");
  lista.innerHTML = "";
 
  let filtrati = prodottiList.filter(p => {
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
 
  filtrati.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.prezzo = p.price ?? '';
    div.dataset.disponibile = p.quantity > 0 ? '1' : '0';
    div.dataset.categoria = p.category_name ?? '';
 
    div.onclick = () => vaiAllaPaginaProdotto(p.product_id);
    div.innerHTML = `
      <img src="${p.photo ? `http://localhost:3000${p.photo}` : 'http://localhost:3000/images/placeholder.jpg'}"
      alt="${p.product_id || 'Senza Nome'}">
      <div class="product-name">${p.product_name || 'Nome mancante'}</div>
      <div class="product-price">€ ${Number(p.price).toFixed(2)}</div>
    `;
    lista.appendChild(div);
  });
}

async function caricaCategorie() {
    const selectCategoria = document.getElementById("filtro-categoria");
    selectCategoria.innerHTML = `<option value="">Tutte le categorie</option>`;

    try {
        const response = await fetch('http://localhost:3000/api/categories');
        const result = await response.json();

        result.categories.forEach(c => {
            const option = document.createElement("option");
            option.value = c.category_name;
            option.textContent = c.category_name;
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error("Errore nel caricamento delle categorie:", error);
    }
}

window.addEventListener("load", () => {
    caricaNuoviArrivi();
    caricaTuttiProdotti();
    caricaCategorie();
});