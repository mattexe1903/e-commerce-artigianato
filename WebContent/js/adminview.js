document.getElementById("exit-btn").addEventListener("click", () => {
  window.location.href = "login.html";
});

window.onload = () => {
  loadArtisanReportList();
};

async function loadArtisanReportList() {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        action: action
      })
    });

    if (!res.ok) {
      throw new Error("Errore nella risposta del server");
    }

    const data = await res.json();

    location.reload();
  } catch (err) {
    console.error(`Errore durante la ${action} della richiesta con ID ${id}:`, err);
  }
}

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