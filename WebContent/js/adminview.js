document.getElementById("exit-btn").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  
  const richieste = [
    { nome: "Mario", cognome: "Rossi", mansione: "Elettricista", iban: "IT60X0542811101000000123456" },
    { nome: "Luca", cognome: "Bianchi", mansione: "Falegname", iban: "IT12A0760105138254035391001" }
  ];
  
  const richiesteList = document.getElementById("richieste-list");
  richieste.forEach(r => {
    const div = document.createElement("div");
    div.className = "richiesta";
    div.innerHTML = `
      <p><strong>Nome:</strong> ${r.nome} ${r.cognome}</p>
      <p><strong>Mansione:</strong> ${r.mansione}</p>
      <p><strong>IBAN:</strong> ${r.iban}</p>
      <button onclick="accettaRichiesta('${r.nome}')">✔ Accetta</button>
    `;
    richiesteList.appendChild(div);
  });
  
  function accettaRichiesta(nome) {
    alert(`Richiesta di ${nome} accettata (qui invierai al DB)`);
  }
  
  const artigiani = [
    { id: 1, nome: "Marco Neri", mansione: "Idraulico" },
    { id: 2, nome: "Franco Verdi", mansione: "Muratore" }
  ];
  
  const listaArtigiani = document.getElementById("artigiani-list");
  artigiani.forEach(a => {
    const div = document.createElement("div");
    div.className = "artigiano";
    div.innerHTML = `
      <p><strong>ID:</strong> ${a.id}</p>
      <p><strong>Nome:</strong> ${a.nome}</p>
      <p><strong>Mansione:</strong> ${a.mansione}</p>
      <button onclick="rimuoviArtigiano(${a.id})">🗑 Rimuovi</button>
    `;
    listaArtigiani.appendChild(div);
  });
  
  function rimuoviArtigiano(id) {
    alert(`Artigiano con ID ${id} rimosso (qui interagisci col DB)`);
  }
  
  const segnalazioni = [
    "Utente X ha segnalato problemi di accesso",
    "Utente Y ha chiesto assistenza per la registrazione"
  ];
  
  const listaSegnalazioni = document.getElementById("segnalazioni-list");
  segnalazioni.forEach(s => {
    const p = document.createElement("p");
    p.textContent = s;
    listaSegnalazioni.appendChild(p);
  });
  
  // Chart.js demo
  const ctx1 = document.getElementById('visiteChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'],
      datasets: [{
        label: 'Visite al sito',
        data: [50, 100, 80, 120, 90],
        backgroundColor: '#f5b400'
      }]
    },
    options: {
      responsive: true
    }
  });
  
  const ctx2 = document.getElementById('venditeChart').getContext('2d');
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['Gen', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Vendite',
        data: [200, 150, 300, 250],
        borderColor: '#f5b400',
        backgroundColor: 'rgba(245, 180, 0, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true
    }
  });
  