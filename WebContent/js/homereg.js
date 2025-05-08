document.addEventListener("DOMContentLoaded", () => {
  aggiornaCarrello();
  caricaNuoviArrivi();
  caricaTuttiProdotti();
});

function getUserId() {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.id || decodedPayload.user_id || null;
  } catch (error) {
    console.error("Errore nel decodificare il token:", error);
    return null;
  }
}


function vaiAllaPaginaProdotto(idProdotto) {
  const userId = getUserId();
  window.location.href = `productsview.html?id=${idProdotto}&user=${userId}`;
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
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) throw new Error("Token non disponibile. Effettua il login.");

    const userId = getUserId();
    if (!userId) throw new Error("ID utente non disponibile.");

    const response = await fetch(`http://localhost:3000/api/cart/${userId}`, {
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
      div.dataset.prezzo = prodotto.price ?? '';
      div.dataset.disponibile = prodotto.quantity > 0 ? '1' : '0';
      div.dataset.categoria = prodotto.category ?? '';
      div.onclick = () => vaiAllaPaginaProdotto(prodotto.product_id);

      div.innerHTML = `
        <img src="${prodotto.photo ? `http://localhost:3000${prodotto.photo}` : 'http://localhost:3000/images/placeholder.jpg'}" 
     alt="${prodotto.product_id || 'Senza Nome'}" 
     style="width:100px;height:auto;">
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
