document.getElementById("exit-btn").addEventListener("click", () => {
  window.location.href = "login.html";
});

window.onload = () => {
  loadReportList();
};

async function loadReportList() {
  try {
    const res = await fetch('http://localhost:3000/api/getArtisanRequest');
    const segnalazioni = await res.json();

    console.log("Richieste di registrazione artigiano:", segnalazioni);

    const tableBody = document.getElementById("richieste-list");
    tableBody.innerHTML = "";

    if (segnalazioni.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">Nessuna richiesta di registrazione artigiano trovata.</td>
        </tr>
      `;
    } else {
      segnalazioni.forEach(report => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${new Date(report.data_creazione).toLocaleDateString()}</td>
          <td>${report.titolo}</td>
          <td>${report.messaggio}</td>
          <td>${report.stato}</td>
          <td>
            <button onclick="handleRequest('${report.id}', 'accettato')">Accetta</button>
            <button onclick="handleRequest('${report.id}', 'rifiutato')">Rifiuta</button>
          </td>
        `;

        tableBody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("Errore nel caricamento delle segnalazioni:", err);
  }
}

async function handleRequest(id, action) {
  const url = `http://localhost:3000/api/updateArtisanRequest`;
  try {
    const res = await fetch(url, {
      method: "POST", // oppure "PATCH" se preferisci
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        action: action // 'accept' o 'reject'
      })
    });

    if (!res.ok) {
      throw new Error("Errore nella risposta del server");
    }

    const data = await res.json();
    console.log("Risposta backend:", data);

    // Ricarica la lista dopo l'aggiornamento
    loadReportList();
  } catch (err) {
    console.error(`Errore durante la ${action} della richiesta con ID ${id}:`, err);
  }
}



/*
// Carica richieste di registrazione
fetch('/api/richieste')
  .then(response => response.json())
  .then(richieste => {
    const richiesteList = document.getElementById("richieste-list");
    richieste.forEach(r => {
      const div = document.createElement("div");
      div.className = "richiesta";
      div.innerHTML = `
        <p><strong>Nome:</strong> ${r.nome} ${r.cognome}</p>
        <p><strong>Mansione:</strong> ${r.mansione}</p>
        <p><strong>IBAN:</strong> ${r.iban}</p>
        <button onclick="accettaRichiesta('${r.id}')">✔ Accetta</button>
      `;
      richiesteList.appendChild(div);
    });
  })
  .catch(error => console.error("Errore caricamento richieste:", error));



function accettaRichiesta(idRichiesta) {
  fetch(`/api/richieste/${idRichiesta}/accetta`, { method: 'POST' })
    .then(response => {
      if (response.ok) {
        alert("Richiesta accettata con successo.");
        location.reload();
      } else {
        alert("Errore nell'accettare la richiesta.");
      }
    });
}

// Carica lista artigiani
fetch('/api/artigiani')
  .then(response => response.json())
  .then(artigiani => {
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
  })
  .catch(error => console.error("Errore caricamento artigiani:", error));

function rimuoviArtigiano(id) {
  fetch(`/api/artigiani/${id}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        alert("Artigiano rimosso con successo.");
        location.reload();
      } else {
        alert("Errore nella rimozione dell'artigiano.");
      }
    });
}

// Carica segnalazioni utenti
fetch('/api/segnalazioni')
  .then(response => response.json())
  .then(segnalazioni => {
    const listaSegnalazioni = document.getElementById("segnalazioni-list");
    segnalazioni.forEach(s => {
      const p = document.createElement("p");
      p.textContent = s.testo;
      listaSegnalazioni.appendChild(p);
    });
  })
  .catch(error => console.error("Errore caricamento segnalazioni:", error));

// Carica dati per i grafici Chart.js
fetch('/api/statistiche/visite')
  .then(response => response.json())
  .then(data => {
    const ctx1 = document.getElementById('visiteChart').getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: data.labels, // ['Lun', 'Mar', ...]
        datasets: [{
          label: 'Visite al sito',
          data: data.visite, // [50, 100, ...]
          backgroundColor: '#f5b400'
        }]
      },
      options: {
        responsive: true
      }
    });
  })
  .catch(error => console.error("Errore caricamento statistiche visite:", error));

fetch('/api/statistiche/vendite')
  .then(response => response.json())
  .then(data => {
    const ctx2 = document.getElementById('venditeChart').getContext('2d');
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: data.labels, // ['Gen', 'Feb', ...]
        datasets: [{
          label: 'Vendite',
          data: data.vendite, // [200, 150, ...]
          borderColor: '#f5b400',
          backgroundColor: 'rgba(245, 180, 0, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true
      }
    });
  })
  .catch(error => console.error("Errore caricamento statistiche vendite:", error));
*/