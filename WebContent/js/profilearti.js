document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "homereg.html";
  });
  
  // Dati Cliente
  const cliente = {
    nome: "Giovanni",
    cognome: "Verdi",
    email: "giovanni@example.com",
    telefono: "+39 012 3456789",
    indirizzo: "Via Roma 1, Milano"
  };
  
  const datiCliente = document.getElementById("dati-clienti");
  datiCliente.innerHTML = `
    <p><strong>Nome:</strong> ${cliente.nome} ${cliente.cognome}</p>
    <p><strong>Email:</strong> ${cliente.email}</p>
    <p><strong>Telefono:</strong> ${cliente.telefono}</p>
    <p><strong>Indirizzo:</strong> ${cliente.indirizzo}</p>
  `;
  
  // Ordini
  const ordini = [
    { data: "2025-04-01", numero: 1001, prezzo: 120, articoli: 3, stato: "Spedito" },
    { data: "2025-04-15", numero: 1002, prezzo: 90, articoli: 2, stato: "In elaborazione" }
  ];
  
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
  
  // Preferiti
  const preferiti = [
    { id: 1, nome: "Prodotto 1", prezzo: 25, immagine: "product1.jpg" },
    { id: 2, nome: "Prodotto 2", prezzo: 50, immagine: "product2.jpg" }
  ];
  
  const preferitiList = document.getElementById("preferiti-list");
  preferiti.forEach(p => {
    const div = document.createElement("div");
    div.className = "prodotto-preferito";
    div.innerHTML = `
      <img src="../images/${p.immagine}" alt="${p.nome}">
      <p>${p.nome}</p>
      <p>€${p.prezzo}</p>
      <button onclick="vaiAllaPaginaProdotto(${p.id})">Vedi Prodotto</button>
    `;
    preferitiList.appendChild(div);
  });
  
  // Inventario
  const inventario = [
    { id: 101, nome: "Articolo 1", prezzo: 15 },
    { id: 102, nome: "Articolo 2", prezzo: 20 }
  ];
  
  const inventarioList = document.getElementById("inventario-list");
  inventario.forEach(i => {
    const div = document.createElement("div");
    div.className = "prodotto-inventario";
    div.innerHTML = `
      <p>ID: ${i.id}</p>
      <p>Nome: ${i.nome}</p>
      <p>Prezzo: €${i.prezzo}</p>
      <button onclick="vaiAllaPaginaProdotto(${i.id})">Modifica</button>
    `;
    inventarioList.appendChild(div);
  });
  
  // Prenotazioni
  const prenotazioni = [
    { data: "2025-04-10", ordine: 1001, articoloId: 101, articoli: 2, stato: "Pronto per la spedizione" },
    { data: "2025-04-12", ordine: 1002, articoloId: 102, articoli: 1, stato: "In elaborazione" }
  ];
  
  const prenotazioniList = document.getElementById("prenotazioni-list");
  prenotazioni.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.data}</td>
      <td>${p.ordine}</td>
      <td>${p.articoloId}</td>
      <td>${p.articoli}</td>
      <td><button onclick="modificaStatoPrenotazione(${p.ordine})">${p.stato}</button></td>
    `;
    prenotazioniList.appendChild(tr);
  });
  
  // Dashboard (Charts)
  const ctx1 = document.getElementById('guadagniChart').getContext('2d');
  new Chart(ctx1, {
    type: 'line',
    data: {
      labels: ['Gen', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Guadagni Mensili',
        data: [3000, 2500, 3500, 4000],
        borderColor: '#f5b400',
        backgroundColor: 'rgba(245, 180, 0, 0.2)',
        fill: true
      }]
    },
    options: { responsive: true }
  });
  
  const ctx2 = document.getElementById('venditeChart').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'],
      datasets: [{
        label: 'Vendite',
        data: [50, 100, 80, 120, 90],
        backgroundColor: '#f5b400'
      }]
    },
    options: { responsive: true }
  });
  
  // Notifiche
  const notifiche = [
    "Un cliente ha aggiunto il prodotto 'Articolo 1' ai preferiti.",
    "Il prodotto 'Articolo 2' è stato venduto.",
    "Hai una nuova prenotazione per l'Articolo 1."
  ];
  
  const notificheList = document.getElementById("notifiche-list");
  notifiche.forEach(n => {
    const li = document.createElement("li");
    li.innerText = n;
    notificheList.appendChild(li);
  });
  
  function vaiAllaPaginaProdotto(id) {
    alert("Vai alla pagina del prodotto ID: " + id);
  }
  
  function modificaStatoPrenotazione(ordine) {
    alert("Modifica stato prenotazione ordine: " + ordine);
  }
  