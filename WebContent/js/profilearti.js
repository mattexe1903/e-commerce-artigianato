document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "homereg.html";
});

// Carica dati cliente
fetch('/api/dati-cliente')
  .then(response => response.json())
  .then(cliente => {
    const datiCliente = document.getElementById("dati-clienti");
    datiCliente.innerHTML = `
      <p><strong>Nome:</strong> ${cliente.nome} ${cliente.cognome}</p>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Telefono:</strong> ${cliente.telefono}</p>
      <p><strong>Indirizzo:</strong> ${cliente.indirizzo}</p>
    `;
  });

// Carica ordini
fetch('/api/ordini')
  .then(response => response.json())
  .then(ordini => {
    const ordiniList = document.getElementById("ordini-list");
    ordini.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.data}</td>
        <td>${o.numero}</td>
        <td>€${o.prezzo}</td>
        <td>${o.articoli}</td>
        <td>${o.stato}</td>
      `;
      ordiniList.appendChild(tr);
    });
  });

// Carica preferiti
fetch('/api/preferiti')
  .then(response => response.json())
  .then(preferiti => {
    const preferitiList = document.getElementById("preferiti-list");
    preferiti.forEach(p => {
      const div = document.createElement("div");
      div.innerHTML = `
        <img src="../images/${p.immagine}" alt="${p.nome}">
        <p>${p.nome}</p>
        <p>€${p.prezzo}</p>
      `;
      preferitiList.appendChild(div);
    });
  });

// Carica inventario
fetch('/api/inventario')
  .then(response => response.json())
  .then(inventario => {
    const inventarioList = document.getElementById("inventario-list");
    inventario.forEach(i => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${i.nome}</strong></p>
        <p>Prezzo: €${i.prezzo}</p>
      `;
      inventarioList.appendChild(div);
    });
  });

  document.getElementById("aggiungi-prodotto-btn").addEventListener("click", () => {
    window.location.href = "productsadd.html";
  });  

// Carica prenotazioni
fetch('/api/prenotazioni')
  .then(response => response.json())
  .then(prenotazioni => {
    const prenotazioniList = document.getElementById("prenotazioni-list");
    prenotazioni.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.data}</td>
        <td>${p.ordine}</td>
        <td>${p.articoloId}</td>
        <td>${p.articoli}</td>
        <td>${p.stato}</td>
      `;
      prenotazioniList.appendChild(tr);
    });
  });

// Carica notifiche
fetch('/api/notifiche')
  .then(response => response.json())
  .then(notifiche => {
    const notificheList = document.getElementById("notifiche-list");
    notifiche.forEach(n => {
      const li = document.createElement("li");
      li.innerText = n.messaggio;
      notificheList.appendChild(li);
    });
  });

// Carica grafici
fetch('/api/dashboard')
  .then(response => response.json())
  .then(data => {
    new Chart(document.getElementById('guadagniChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: data.mesi,
        datasets: [{
          label: 'Guadagni',
          data: data.gadagni,
          borderColor: '#f5b400',
          backgroundColor: 'rgba(245,180,0,0.2)',
          fill: true
        }]
      },
      options: { responsive: true }
    });

    new Chart(document.getElementById('venditeChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: data.settimana,
        datasets: [{
          label: 'Vendite',
          data: data.vendite,
          backgroundColor: '#f5b400'
        }]
      },
      options: { responsive: true }
    });
  });
