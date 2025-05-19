document.getElementById("home-btn").addEventListener("click", () => {
  const tokenRaw = localStorage.getItem("token");
  const token = JSON.parse(tokenRaw);

  fetch('http://localhost:3000/api/userInfo', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const role = data.user.user_role;

      if (role === 3) {
        // Rimuove il token dalla sessione per gli artigiani
        localStorage.removeItem("token");
        window.location.href = "../home.html";
      } else {
        window.location.href = "homereg.html";
      }
    })
    .catch(() => {
      localStorage.removeItem("token"); // in caso di errore, rimuove il token
      window.location.href = "homereg.html";
    });
});


window.onload = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const resUser = await fetch('http://localhost:3000/api/userInfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resUser.ok) throw new Error("Errore nel caricamento dati utente");

    const { user, addresses = [] } = await resUser.json();
    const role = user.user_role;

    document.getElementById("titolo-bentornato").innerText = `Benvenuto, ${user.user_name}`;
    document.getElementById("sidebar-title").innerText = role === 3 ? "Lokal" : "Profilo";

    const indirizzo = addresses.length
      ? addresses.map(a => `${a.street_address}, ${a.city}, ${a.cap}, ${a.province}, ${a.country}`).join(" | ")
      : "Indirizzo mancante";

    document.getElementById("dati-utente").innerHTML = `
      <p><strong>Nome:</strong> ${user.user_name} ${user.surname}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Indirizzo:</strong> ${indirizzo}</p>
    `;

    const navList = document.getElementById("nav-list");

    if (role === 3) {
      // ARTIGIANO
      ["ordini-section", "preferiti-section"].forEach(id => {
        document.getElementById(id)?.classList.add("hidden");
      });

      const vociDaRimuovere = ["I miei ordini", "I miei preferiti"];
      [...navList.children].forEach(li => {
        if (vociDaRimuovere.some(text => li.innerText.includes(text))) {
          navList.removeChild(li);
        }
      });

      ["inventario", "prenotazioni", "dashboard"].forEach(id => {
        document.getElementById(id)?.classList.remove("hidden");
      });

      ["Inventario", "Prenotazioni", "Dashboard"].forEach(section => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${section.toLowerCase()}">${section}</a>`;
        navList.insertBefore(li, navList.lastElementChild);
      });

      // INVENTARIO
      const resInventario = await fetch('http://localhost:3000/api/getInventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resInventario.ok) throw new Error("Errore nel caricamento dell'inventario");

      const inventario = await resInventario.json();
      const inventarioList = document.getElementById("inventario-list");
      inventarioList.innerHTML = "";

      if (inventario.length === 0) {
        inventarioList.innerHTML = "<p>Inventario vuoto</p>";
      } else {
        inventario.forEach(i => {
          const div = document.createElement("div");
          div.classList.add("prodotto");
          div.innerHTML = `
            <p><strong>${i.product_name}</strong></p>
            <p>Prezzo: €${i.price}</p>
            <p>Quantità: ${i.quantity}</p>
          `;
          div.onclick = () => window.location.href = `productsupdate.html?id=${i.product_id}`;
          inventarioList.appendChild(div);
        });
      }

      document.getElementById("aggiungi-prodotto-btn").addEventListener("click", () => {
        window.location.href = "productsadd.html";
      });

      // PRENOTAZIONI
      const resPrenotazioni = await fetch('http://localhost:3000/api/getOrdersByArtisanId', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const prenotazioni = await resPrenotazioni.json();
      const prenotazioniList = document.getElementById("prenotazioni-list");
      prenotazioniList.innerHTML = "";

      if (prenotazioni.length === 0) {
        prenotazioniList.innerHTML = `
          <tr>
            <td colspan="5">Non ci sono prenotazioni relative ai tuoi prodotti.</td>
          </tr>
        `;
      } else {
        prenotazioni.forEach(order => {
          const articoliHtml = order.products.map(p => `
            <div style="margin-bottom: 0.5rem;">
              <strong>${p.product_name}</strong> (ID: ${p.product_id})<br/>
              Quantità: ${p.quantity}<br/>
              Prezzo unitario: €${Number(p.single_price).toFixed(2)}
            </div>
          `).join("");

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${new Date(order.order_date).toLocaleDateString()}</td>
            <td>#${order.order_id}</td>
            <td>${order.products.map(p => p.product_id).join(", ")}</td>
            <td>${articoliHtml}</td>
            <td>${order.state_name}</td>
          `;
          prenotazioniList.appendChild(tr);
        });
      }

      // DASHBOARD - GRAFICO VENDITE
      async function creaGraficoVenditeGiornaliere(token) {
        try {
          const response = await fetch('http://localhost:3000/api/salesByArtisanId', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Errore nel recupero dei dati');

          const dati = await response.json();
          const ctx = document.getElementById('venditeChart').getContext('2d');

          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: dati.labels,
              datasets: [{
                label: 'Vendite giornaliere',
                data: dati.dati,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
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

          document.getElementById("dashboard")?.classList.remove("hidden");
        } catch (errore) {
          console.error('Errore nel caricamento del grafico:', errore);
        }
      }

      // CHIAMATA GRAFICO
      await creaGraficoVenditeGiornaliere(token);

    } else {
      // CLIENTE
      const resOrdini = await fetch('http://localhost:3000/api/getOrdersByUserId', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const orderList = await resOrdini.json();
      const ordiniTable = document.getElementById("ordini-list");
      ordiniTable.innerHTML = "";

      if (orderList.length === 0) {
        ordiniTable.innerHTML = `
          <tr>
            <td colspan="5">Non hai ancora effettuato ordini.</td>
          </tr>
        `;
      } else {
        orderList.forEach(order => {
          const articoli = order.products.map(p => `
            <div style="margin-bottom: 0.5rem;">
              <strong>${p.product_name}</strong><br/>
              Quantità: ${p.quantity}<br/>
              €${Number(p.single_price).toFixed(2)}
            </div>
          `).join("");

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${new Date(order.order_date).toLocaleDateString()}</td>
            <td>#${order.order_id}</td>
            <td>€${Number(order.total).toFixed(2)}</td>
            <td>${articoli}</td>
            <td>${order.state_name}</td>
          `;
          ordiniTable.appendChild(tr);
        });
      }
      // PREFERITI
      const res = await fetch('http://localhost:3000/api/favourites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const result = await res.json();
      const preferiti = result.data;
      const lista = document.getElementById("lista-preferiti");
      lista.innerHTML = "";

      if (preferiti.length === 0) {
        lista.innerHTML = "<p>Non hai ancora aggiunto prodotti ai preferiti.</p>";
      } else {
        preferiti.forEach(p => {
          const card = document.createElement("div");
          card.className = "prodotto";
          card.innerHTML = `
            <img src="http://localhost:3000${p.photo || '/images/placeholder.jpg'}" alt="${p.product_name}" />
            <p>${p.product_name}</p>
            <p>€${Number(p.price).toFixed(2)}</p>
          `;
          card.onclick = () => window.location.href = `productsview.html?id=${p.product_id}`;
          lista.appendChild(card);
        });
      }
    }

  } catch (err) {
    console.error("Errore:", err);
    alert("C'è stato un errore nel caricamento del profilo.");
  }
};


