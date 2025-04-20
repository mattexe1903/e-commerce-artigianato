// Funzione che carica i dettagli del prodotto dalla query string
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
      // Simula il recupero dei dati dal DB (sostituire con chiamata reale al DB)
      // Qui i dati vengono mockati, ma dovrebbero essere presi dal database tramite l'ID
      const prodotto = getProdottoById(productId);
      if (prodotto) {
        // Popola i dati nella pagina
        document.getElementById('product-img').src = prodotto.imgUrl;
        document.getElementById('product-name').innerText = prodotto.nome;
        document.getElementById('product-category').innerText = prodotto.categoria;
        document.getElementById('product-description-text').innerText = prodotto.descrizione;
        document.getElementById('product-price').innerText = `€${prodotto.prezzo}`;
        document.getElementById('product-quantity').innerText = prodotto.quantita;
        document.getElementById('quantity-input').max = prodotto.quantita;  // Limita la quantità al valore disponibile
      }
    }
  };
  
  // Simulazione dati da DB
  function getProdottoById(id) {
    const prodotti = [
      {
        id: 1,
        nome: "Prodotto 1",
        imgUrl: "../images/prodotto1.jpg",
        descrizione: "Descrizione dettagliata del prodotto 1.",
        categoria: "Legno",
        prezzo: "19.99",
        quantita: 20,
      },
      {
        id: 2,
        nome: "Prodotto 2",
        imgUrl: "../images/prodotto2.jpg",
        descrizione: "Descrizione dettagliata del prodotto 2.",
        categoria: "Vetro",
        prezzo: "24.99",
        quantita: 15,
      }
    ];
    return prodotti.find(p => p.id === parseInt(id));
  }
  
  // Funzione per aggiungere ai preferiti
  function aggiungiAiPreferiti() {
    const prodottoId = new URLSearchParams(window.location.search).get('id');
    if (!prodottoId) return;
  
    const utenteLoggato = false; // Simula l'utente loggato (sostituire con il check effettivo)
  
    if (utenteLoggato) {
      // Simulazione aggiunta ai preferiti
      // Qui dovresti inviare l'ID al tuo DB per associare il prodotto all'utente loggato
      console.log(`Prodotto ${prodottoId} aggiunto ai preferiti!`);
      document.getElementById('heart-icon').style.color = 'red'; // Cambia colore cuore per indicare preferito
    } else {
      // Mostra pop-up login
      document.getElementById('login-popup').style.display = 'flex';
    }
  }
  
  // Funzione per aggiungere al carrello
  function aggiungiAlCarrello() {
    const prodottoId = new URLSearchParams(window.location.search).get('id');
    const quantita = document.getElementById('quantity-input').value;
    if (!prodottoId || !quantita) return;
  
    const utenteLoggato = false; // Simula l'utente loggato (sostituire con il check effettivo)
  
    if (utenteLoggato) {
      // Simulazione aggiunta al carrello
      // Qui dovresti inviare l'ID e la quantità al tuo DB per aggiornare il carrello dell'utente
      console.log(`Prodotto ${prodottoId} aggiunto al carrello con quantità ${quantita}.`);
      alert("Prodotto aggiunto al carrello!");
    } else {
      // Mostra pop-up login
      document.getElementById('login-popup').style.display = 'flex';
    }
  }
  
  // Verifica che la quantità non superi quella disponibile
  function verificaQuantita() {
    const maxQuantita = document.getElementById('quantity-input').max;
    const quantitaSelezionata = document.getElementById('quantity-input').value;
    
    if (quantitaSelezionata > maxQuantita) {
      alert("La quantità selezionata supera quella disponibile.");
      document.getElementById('quantity-input').value = maxQuantita;  // Limita la quantità al massimo disponibile
    }
  }
  