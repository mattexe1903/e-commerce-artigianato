document.addEventListener("DOMContentLoaded", () => {
  caricaCarrello();
});

function getToken() {
  return JSON.parse(localStorage.getItem("token"));
}

function getUserId() {
  const token = getToken();
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

let prodottiCarrello = [];

async function caricaCarrello() {
  try {
    const userId = getUserId();
    const token = getToken();
    if (!userId || !token) throw new Error("Utente non autenticato.");

    const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Errore nel recupero carrello.");

    prodottiCarrello = data.cart || [];
    console.log("Carrello:", prodottiCarrello);

    const sezioneVuota = document.getElementById("empty-cart");
    const contenutoCarrello = document.getElementById("cart-content");
    const lista = document.getElementById("cart-items");
    const riepilogo = document.getElementById("summary-items");

    lista.innerHTML = "";
    riepilogo.innerHTML = "";

    if (prodottiCarrello.length === 0) {
      sezioneVuota.style.display = "block";
      contenutoCarrello.style.display = "none";
      return;
    }

    sezioneVuota.style.display = "none";
    contenutoCarrello.style.display = "flex";

    prodottiCarrello.forEach((p, index) => {
      const prezzo = Number(p.product?.price || p.price || 0);
      const quantita = p.quantity || 1;

      const riga = document.createElement("div");
      riga.className = "cart-item";
      riga.innerHTML = `
        <span>${p.product_name}</span>
        <span>${p.photo_description || '-'}</span>
        <span>€${prezzo.toFixed(2)}</span>
        <span>${quantita}</span>
        <span><button onclick="apriModale(${index})">🗑</button></span>
      `;
      lista.appendChild(riga);

      const rigaRiepilogo = document.createElement("p");
      rigaRiepilogo.innerText = `${p.product_name} x${quantita} = €${(prezzo * quantita).toFixed(2)}`;
      riepilogo.appendChild(rigaRiepilogo);
    });

    aggiornaTotale();
  } catch (err) {
    console.error("Errore caricamento carrello:", err.message || err);
  }
}

function aggiornaTotale() {
  const totaleArticoli = prodottiCarrello.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const prezzoArticoli = prodottiCarrello.reduce((acc, item) => {
    const prezzo = Number(item.product?.price || item.price || 0);
    const quantita = item.quantity || 1;
    return acc + (prezzo * quantita);
  }, 0);
  const spedizione = 5.99;
  const totale = prezzoArticoli + spedizione;

  document.getElementById("total-items").innerText = totaleArticoli;
  document.getElementById("items-price").innerText = prezzoArticoli.toFixed(2);
  document.getElementById("total-price").innerText = totale.toFixed(2);
}

// MODALE
let prodottoSelezionato = null;

function apriModale(index) {
  prodottoSelezionato = prodottiCarrello[index];
  document.getElementById("modal-item-name").innerText = `${prodottoSelezionato.product_name} (max ${prodottoSelezionato.quantity})`;
  document.getElementById("remove-quantity").max = prodottoSelezionato.quantity;
  document.getElementById("remove-quantity").value = 1;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-error").style.display = "none";
}

async function confirmPartialRemove() {
  const qty = parseInt(document.getElementById("remove-quantity").value);
  const errorMsg = document.getElementById("modal-error");

  if (isNaN(qty) || qty < 1 || qty > prodottoSelezionato.quantity) {
    errorMsg.innerText = "Quantità non valida.";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const token = getToken();
    console.log("Token:", token);
    console.log("prodottoSelezionato", prodottoSelezionato.product_id);

    const res = await fetch(`http://localhost:3000/api/cart/remove`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product_id: prodottoSelezionato.product_id, quantity: qty })
    });

    if (!res.ok) {
      throw new Error("Errore durante la rimozione del prodotto.");
    }

    closeModal();
    caricaCarrello();
  } catch (err) {
    errorMsg.innerText = err.message;
    errorMsg.style.display = "block";
  }
}

function proceedOrder() {
  const userId = getUserId();
  if (!userId) {
    alert("Devi essere loggato per procedere al pagamento.");
    return;
  }

  alert("Verrai reindirizzato alla pagina di pagamento...");
  window.location.href = `payment.html?user=${userId}`;
}
