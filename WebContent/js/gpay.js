  async function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
  }
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
}
    })
    .catch(err => {
});
}

// === CREAZIONE DEL PULSANTE ===

function createAndAddGooglePayButton() {
  if (!paymentsClient) {
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
}
}

// === GESTIONE CLICK ===

function onGooglePayClicked() {
  if (!paymentsClient) {
return;
  }

  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [cardPaymentMethod],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: getTotalAmount(),
      currencyCode: 'EUR',
      countryCode: 'IT'
    },
    merchantInfo: {
      merchantName: "Demo E-commerce"
    }
  };

  paymentsClient.loadPaymentData(paymentDataRequest)
    .then(paymentData => {
showToast("Pagamento effettuato con successo (test)!");
      sendOrder();
    })
    .catch(err => {
showToast("Pagamento annullato o fallito.");
    });
}