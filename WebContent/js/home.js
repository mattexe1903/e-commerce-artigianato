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

    try {
        const response = await fetch('http://localhost:3000/api/latest');
        const dati = await response.json();
        const prodotti = Array.isArray(dati.products) ? dati.products : [];

        prodotti.forEach(prodotto => {
            const div = document.createElement('div');
            div.className = 'product';
            div.onclick = () => vaiAllaPaginaProdotto(prodotto.product_id);

            const immagineURL = `http://localhost:3000${prodotto.photo || '/images/placeholder.jpg'}`;

            div.innerHTML = `
        <img src="${immagineURL}" alt="${prodotto.product_name || 'Prodotto'}">
        <div>${prodotto.product_name}</div>
        <div>€${parseFloat(prodotto.price || 0).toFixed(2)}</div>
      `;
            track.appendChild(div);
        });

        // Per effetto infinito
        track.innerHTML += track.innerHTML;
    } catch (err) {
        console.error('Errore nel caricare i nuovi arrivi:', err);
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
    const categoria = document.getElementById("filtro-categoria").value.toLowerCase();
    const ordinePrezzo = document.getElementById("filtro-prezzo").value;
    const disponibilita = document.getElementById("filtro-disponibilita").value;

    let filtrati = prodottiList.filter(p => {
        const cat = p.category_name?.toLowerCase() || '';
        if (categoria && cat !== categoria) return false;
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

    const lista = document.getElementById("product-list");
    lista.innerHTML = "";
    filtrati.forEach(p => lista.appendChild(creaElementoProdotto(p)));
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