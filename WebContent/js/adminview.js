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

    const tableBody = document.getElementById("segnalazioni-list");
    tableBody.innerHTML = "";

    if (segnalazioni.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">Nessuna richiesta di registrazione artigiano trovata.</td>
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
        `;

        tableBody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("Errore nel caricamento delle segnalazioni:", err);
  }
}

// Carica richieste di registrazione
fetch('http://localhost:3000/api/getArtisanRequest')
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
fetch('http://localhost:3000/api/getArtisanRegistered')
  .then(response => response.json())
  .then(artigiani => {
    const listaArtigiani = document.getElementById("artigiani-list");
    artigiani.forEach(a => {
      const div = document.createElement("div");
      div.className = "artigiano";
      div.innerHTML = `
        <div class="row">
          <p><strong>ID:</strong> ${a.artisan_id}</p>
          <button class="delete-btn" onclick="rimuoviArtigiano(${a.artisan_id})">🗑 Rimuovi</button>
        </div>
        <div class="row">
          <p><strong>Nome:</strong> ${a.user_name}</p>
          <p><strong>Cognome:</strong> ${a.surname}</p>
        </div>
        <div class="row">
          <p><strong>IBAN:</strong> ${a.iban}</p>
          <p><strong>Mansione:</strong> ${a.craft}</p>
        </div>
      `;
      listaArtigiani.appendChild(div);
    });
  })
  .catch(error => console.error("Errore caricamento artigiani:", error));


function rimuoviArtigiano(id) {
  const conferma = window.confirm("Sei sicuro di voler eliminare questo artigiano?");
  if (!conferma) return;

  fetch(`http://localhost:3000/api/artisan/${id}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        alert("Artigiano rimosso con successo.");
        location.reload();
      } else {
        alert("Errore nella rimozione dell'artigiano.");
      }
    })
    .catch(error => {
      console.error("Errore nella richiesta di eliminazione:", error);
      alert("Errore imprevisto durante la rimozione.");
    });
}

/*
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