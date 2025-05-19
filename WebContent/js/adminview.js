  async function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
  }

document.getElementById("exit-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  showToast("Logout effettuato");
  setTimeout(() => {
    window.location.href = "../home.html";
  }, 1500);
});


window.onload = () => {
  loadArtisanReportList();
  loadReportList();
  creaGraficoVendite();
};

async function loadArtisanReportList() {
  try {
    const res = await fetch('http://localhost:3000/api/getArtisanRequest');
    const segnalazioni = await res.json();
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
}
}

async function loadReportList() {
  try {
    const res = await fetch('http://localhost:3000/api/getSignal');
    const segnalazioni = await res.json();


    const tableBody = document.getElementById("segnalazioni-list");
    tableBody.innerHTML = "";
if (segnalazioni.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">Nessuna segnalazione trovata.</td>
        </tr>
      `;
    } else {
      segnalazioni.forEach(report => {
        const tr = document.createElement("tr");

      tr.innerHTML = `
        <td style="padding: 10px;">${new Date(report.data_creazione).toLocaleDateString()}</td>
        <td style="padding: 10px; font-weight: bold;">${report.titolo}</td>
        <td style="padding: 10px; ">${report.email}</td>
        <td style="padding: 10px; max-width: 300px; word-wrap: break-word;">${report.messaggio}</td>
        <td style="padding: 10px;>${report.stato}</td>
      `;


        tableBody.appendChild(tr);
      });
    }
  } catch (err) {
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
        showToast("Artigiano rimosso con successo.");
        location.reload();
      } else {
        showToast("Errore nella rimozione dell'artigiano.");
      }
    })
    .catch(error => {
showToast("Errore imprevisto durante la rimozione.");
    });
}

async function creaGraficoVendite() {
  try {
    const response = await fetch('http://localhost:3000/api/sales');
    if (!response.ok) throw new Error('Errore nel recupero dei dati');

    const dati = await response.json();

    const ctx = document.getElementById('venditeChart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dati.labels,
        datasets: [{
          label: 'Vendite mensili',
          data: dati.dati,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (errore) {
}
}