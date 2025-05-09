document.addEventListener("DOMContentLoaded", async () => {
  await loadUserData();
  await loadCartData();
  setupPaymentSelection();
  setupSaveCheckboxes();
});

function getToken() {
  return JSON.parse(localStorage.getItem("token"));
}

async function loadUserData() {
  const token = getToken(); 
  
  try {
    const response = await fetch('http://localhost:3000/api/userInfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    const user = data.user;
    const address = data.addresses && data.addresses[0];

    document.getElementById("address-name").textContent = user.user_name;
    document.getElementById("address-surname").textContent = user.surname;

    if (address) {
      document.getElementById("address-street").value = address.street_address || "";
      document.getElementById("address-city").value = address.city || "";
      document.getElementById("address-zip").value = address.cap || "";
      document.getElementById("address-province").value = address.province || "";
    } else {
      document.getElementById("address-street").value = "";
      document.getElementById("address-city").value = "";
      document.getElementById("address-zip").value = "";
      document.getElementById("address-province").value = "";
    }
  } catch (err) {
    console.error("Errore caricamento dati utente:", err);
  }
}

async function loadCartData() {
  try {
    const token = getToken();
    if (!token) throw new Error("Utente non autenticato.");

    const res = await fetch(`http://localhost:3000/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Errore nel recupero carrello.");

    const prodottiCarrello = data.cart || [];

    const summaryItems = document.getElementById("summary-items");
    const totalItemsSpan = document.getElementById("total-items");
    const itemsPriceSpan = document.getElementById("items-price");
    const totalPriceSpan = document.getElementById("total-price");

    let totalItems = 0;
    let itemsTotal = 0;

    summaryItems.innerHTML = "";

    prodottiCarrello.forEach(item => {
      const nome = item.product_name || item.name || "Prodotto";
      const prezzoUnitario = Number(item.product?.price || item.price || 0);
      const quantita = item.quantity || 1;

      const row = document.createElement("p");
      row.textContent = `${nome} x${quantita} = €${(prezzoUnitario * quantita).toFixed(2)}`;
      summaryItems.appendChild(row);

      totalItems += quantita;
      itemsTotal += prezzoUnitario * quantita;
    });

    const spedizione = 5.99;

    totalItemsSpan.textContent = totalItems;
    itemsPriceSpan.textContent = itemsTotal.toFixed(2);
    totalPriceSpan.textContent = (itemsTotal + spedizione).toFixed(2);
  } catch (err) {
    console.error("Errore caricamento carrello:", err.message || err);
  }
}

//TODO
function setupPaymentSelection() {
  document.querySelectorAll(".pay-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const method = btn.dataset.method;
      const form = document.getElementById("payment-form");

      document.querySelectorAll(".pay-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      form.innerHTML = "";
      form.setAttribute("data-method", method);

      if (method === "card") {
        form.innerHTML = `
          <label>Numero carta
            <input type="text" id="payment-card" placeholder="•••• •••• •••• ••••" required />
          </label>
          <label>Scadenza
            <input type="text" id="payment-expiry" placeholder="MM/AA" required />
          </label>
          <label>CVV
            <input type="text" id="payment-cvv" placeholder="123" required />
          </label>
          <label>Intestatario
            <input type="text" id="payment-name" required />
          </label>
        `;
      } else if (method === "paypal") {
        form.innerHTML = `
          <label>Email PayPal
            <input type="email" id="payment-paypal" required />
          </label>
        `;
      } else {
        form.innerHTML = `<p style="grid-column: span 2;">Verrai reindirizzato a <strong>${method === "google" ? "Google Pay" : "Apple Pay"}</strong> per completare il pagamento.</p>`;
      }
    });
  });
}

//TODO
function setupSaveCheckboxes() {
  document.getElementById("save-address").addEventListener("change", e => {
    e.target.dataset.save = e.target.checked;
  });
  document.getElementById("save-payment").addEventListener("change", e => {
    e.target.dataset.save = e.target.checked;
  });
}

//TODO
async function sendOrder() {
  const userId = getUserId();
  const saveAddress = document.getElementById("save-address").checked;
  const savePayment = document.getElementById("save-payment").checked;
  const paymentMethod = document.getElementById("payment-form").dataset.method;

  if (!paymentMethod) {
    return showPopup("Errore", "Seleziona un metodo di pagamento.");
  }

  try {
    const orderData = {
      userId,
      date: new Date().toISOString(),
      paymentMethod,
      address: {
        name: document.getElementById("addr-name").value,
        surname: document.getElementById("addr-surname").value,
        street: document.getElementById("addr-street").value,
        city: document.getElementById("addr-city").value,
        cap: document.getElementById("addr-cap").value,
        phone: document.getElementById("addr-phone").value,
      },
      paymentDetails: getPaymentDetails(paymentMethod),
      saveAddress,
      savePayment,
    };

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();

    if (result.success) {
      await fetch(`/api/cart/clear/${userId}`, { method: "POST" });
      showPopup("Ordine completato", "Riceverai una mail con i dettagli.", () => {
        window.location.href = "/home";
      });
    } else {
      showPopup("Errore", "Ordine fallito. Riprova.");
    }
  } catch (err) {
    console.error("Errore invio ordine:", err);
    showPopup("Errore", "Errore durante l'invio dell'ordine.");
  }
}

//TODO
function getPaymentDetails(method) {
  if (method === "card") {
    return {
      type: "card",
      card: document.getElementById("payment-card").value,
      expiry: document.getElementById("payment-expiry").value,
      cvv: document.getElementById("payment-cvv").value,
      name: document.getElementById("payment-name").value,
    };
  } else if (method === "paypal") {
    return {
      type: "paypal",
      email: document.getElementById("payment-paypal").value,
    };
  }
  return { type: method };
}

//TODO
function showPopup(title, message, callback = null) {
  const popup = document.createElement("div");
  popup.className = "modal-overlay";
  popup.innerHTML = `
    <div class="modal-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="modal-buttons">
        <button id="popup-close">Ok</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("popup-close").onclick = () => {
    popup.remove();
    if (callback) callback();
  };
}