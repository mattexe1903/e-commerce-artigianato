
let saveAddressFn;

document.addEventListener("DOMContentLoaded", async () => {
  await loadUserData();
  await loadCartData();
  setupPaymentSelection();
  saveAddressFn = await setupSaveCheckboxes();
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

    document.getElementById("address-street").value = address?.street_address || "";
    document.getElementById("address-city").value = address?.city || "";
    document.getElementById("address-zip").value = address?.cap || "";
    document.getElementById("address-province").value = address?.province || "";
  } catch (err) {
    console.error("Errore caricamento dati utente:", err);
  }
}

async function loadCartData() {
  try {
    const token = getToken();
    if (!token) throw new Error("Utente non autenticato.");

    const res = await fetch(`http://localhost:3000/api/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
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
            <input type="text" id="payment-card" required />
          </label>
          <label>Scadenza
            <input type="text" id="payment-expiry" required />
          </label>
          <label>CVV
            <input type="text" id="payment-cvv" required />
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
      } else if (method === "google") {
        form.innerHTML = `
          <div id="google-pay-button"></div>
        `;
        loadGooglePayButton();
      } else {
        form.innerHTML = `<p style="grid-column: span 2;">Verrai reindirizzato a <strong>Apple Pay</strong> per completare il pagamento.</p>`;
      }
    });
  });
}

function loadGooglePayButton() {
  const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
  const button = paymentsClient.createButton({
    onClick: onGooglePayClicked,
    allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD']
  });
  document.getElementById("google-pay-button").appendChild(button);
}

async function setupSaveCheckboxes() {
  const addressCheckbox = document.getElementById("save-address");

  const saveAddress = async (addressData) => {
    const token = getToken();
    const shouldSave = addressCheckbox.checked;

    const response = await fetch('http://localhost:3000/api/addAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        address: addressData,
        saveForUser: shouldSave
      })
    });

    if (!response.ok) {
      console.error("Errore nel salvataggio dell'indirizzo:", await response.text());
    } else {
      console.log("Indirizzo salvato con successo.");
    }
  };

  return saveAddress;
}

async function sendOrder() {
  const token = getToken();
  const addressData = {
    street: document.getElementById("address-street").value,
    city: document.getElementById("address-city").value,
    cap: document.getElementById("address-zip").value,
    province: document.getElementById("address-province").value,
  };
  const method = document.getElementById("payment-form").dataset.method;
  const saveAddressChecked = document.getElementById("save-address").checked;

  if (!method) {
    return showPopup("Errore", "Seleziona un metodo di pagamento.");
  }

  try {
    if (saveAddressChecked && typeof saveAddressFn === "function") {
      await saveAddressFn(addressData);
    }

    const paymentDetails = getPaymentDetails(method);

    const orderData = {
      token,
      date: new Date().toISOString(),
      paymentMethod: method,
      paymentDetails,
      address: addressData,
      saveAddress: saveAddressChecked,
    };

    const res = await fetch("http://localhost:3000/api/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();
    console.log("Risultato invio ordine:", result);

    showPopup("Ordine completato", "Riceverai una mail con i dettagli.", () => {
      setTimeout(() => {
        window.location.href = "homereg.html";
      }, 5000);
    });
  } catch (err) {
    console.error("Errore invio ordine:", err);
    showPopup("Errore", "Errore durante l'invio dell'ordine.");
  }
}

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
  } else if (method === "google") {
    return {
      type: "google",
      token: "simulated_google_token"
    };
  }
  return { type: method };
}

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

function getTotalAmount() {
  const el = document.getElementById("total-price");
  if (!el) return '14.99';

  const raw = el.textContent.trim().replace('€', '').replace(',', '.');
  const parsed = parseFloat(raw);

  return isNaN(parsed) ? '14.99' : parsed.toFixed(2);
}
