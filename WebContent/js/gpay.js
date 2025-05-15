// === CONFIGURAZIONE BASE ===

// Metodo di pagamento base (test)
const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    allowedCardNetworks: ['VISA', 'MASTERCARD']
  }
};

// Simulazione tokenizzazione (gateway finto per test)
const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    gateway: 'example', // Lascia "example" per test
    gatewayMerchantId: 'exampleMerchantId'
  }
};

// Metodo di pagamento completo con tokenizzazione
const cardPaymentMethod = {
  ...baseCardPaymentMethod,
  tokenizationSpecification
};

let paymentsClient = null;

// === INIZIALIZZAZIONE SICURA ===

window.addEventListener("load", () => {
  if (window.google && google.payments && google.payments.api) {
    initGooglePay();
  } else {
    console.error("❌ Google Pay API non disponibile.");
  }
});

function initGooglePay() {
  paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

  const isReadyToPayRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [baseCardPaymentMethod]
  };

  paymentsClient.isReadyToPay(isReadyToPayRequest)
    .then(response => {
      if (response.result) {
        createAndAddGooglePayButton();
      } else {
        console.warn("⚠️ Google Pay non disponibile per questo dispositivo.");
      }
    })
    .catch(err => {
      console.error("❌ Errore in isReadyToPay:", err);
    });
}

// === CREAZIONE DEL PULSANTE ===

function createAndAddGooglePayButton() {
  if (!paymentsClient) {
    console.error("❌ paymentsClient non inizializzato.");
    return;
  }

  const button = paymentsClient.createButton({
    onClick: onGooglePayClicked
  });

  const target = document.getElementById("google-pay-button");
  if (target) {
    target.innerHTML = ""; // pulizia in caso di re-render
    target.appendChild(button);
  } else {
    console.warn("⚠️ Elemento #google-pay-button non trovato.");
  }
}

// === GESTIONE CLICK ===

function onGooglePayClicked() {
  if (!paymentsClient) {
    console.error("❌ paymentsClient non disponibile.");
    return;
  }

  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [cardPaymentMethod],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '14.99', // Cambia qui per testare altri importi
      currencyCode: 'EUR',
      countryCode: 'IT'
    },
    merchantInfo: {
      merchantName: "Demo E-commerce"
    }
  };

  paymentsClient.loadPaymentData(paymentDataRequest)
    .then(paymentData => {
      console.log("✅ Pagamento simulato:", paymentData);
      alert("Pagamento effettuato con successo (test)!");
    })
    .catch(err => {
      console.warn("❌ Pagamento annullato o errore:", err.statusCode || err);
      alert("Pagamento annullato o fallito.");
    });
}