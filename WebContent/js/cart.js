document.addEventListener("DOMContentLoaded", () => {
  caricaCarrello();
});

function getUserId() {
  return new URLSearchParams(window.location.search).get("user") || "123";
}

async function caricaCarrello() {
  try {
    const userId = getUserId();
    const res = await fetch(`/api/cart/${userId}`);
    const prodotti = await res.json();

    const lista = document.getElementById("lista-prodotti");
    lista.innerHTML = "";

    if (prodotti.length === 0) {
      lista.innerHTML = "<p>Il carrello è vuoto.</p>";
      aggiornaTotale(0);
      return;
    }

    prodotti.forEach(p => {
      const div = document.createElement("div");
      div.className = "prodotto-carrello";
      div.innerHTML = `
        <p>${p.name} - €${p.price.toFixed(2)}</p>
        <button onclick="rimuoviDalCarrello('${p.id}')">Rimuovi</button>
      `;
      lista.appendChild(div);
    });

    const totale = prodotti.reduce((acc, p) => acc + p.price, 0);
    aggiornaTotale(totale);
  } catch (err) {
    console.error("Errore caricamento carrello:", err);
  }
}

async function rimuoviDalCarrello(idProdotto) {
  try {
    const userId = getUserId();
    await fetch(`/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: idProdotto }),
    });

    await caricaCarrello(); // 🔥 Ricarica dinamicamente dopo rimozione
  } catch (err) {
    console.error("Errore rimozione prodotto:", err);
  }
}

function aggiornaTotale(totale) {
  document.getElementById("totale-carrello").innerText = `Totale: €${totale.toFixed(2)}`;
}

function paga() {
  const userId = getUserId();
  alert("verrai reindirizzato alla pagina di pagamento.");
  window.location.href = `payment.html?user=${userId}`;
}
