document.getElementById("home-btn").addEventListener("click", () => {
  const tokenRaw = localStorage.getItem("token");
  const token = JSON.parse(tokenRaw);

  fetch('http://localhost:3000/api/userInfo', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const role = data.user.user_role;
      window.location.href = role === 3 ? "../home.html" : "homereg.html";
    })
    .catch(() => window.location.href = "homereg.html");
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

    // Header e titolo
    document.getElementById("titolo-bentornato").innerText = `Benvenuto, ${user.user_name}`;
    document.getElementById("sidebar-title").innerText = role === 3 ? "Lokal" : "Profilo";

    // Dati utente
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

      // Nascondi sezioni cliente
      ["ordini-section", "preferiti-section"].forEach(id => {
        document.getElementById(id)?.classList.add("hidden");
      });

      // Rimuovi voci cliente dalla sidebar
      const vociDaRimuovere = ["I miei ordini", "I miei preferiti"];
      [...navList.children].forEach(li => {
        if (vociDaRimuovere.some(text => li.innerText.includes(text))) {
          navList.removeChild(li);
        }
      });

      // Mostra sezioni artigiano
      ["inventario", "prenotazioni", "dashboard"].forEach(id => {
        document.getElementById(id)?.classList.remove("hidden");
      });

      // Aggiungi voci artigiano alla sidebar
      ["Inventario", "Prenotazioni", "Dashboard"].forEach(section => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${section.toLowerCase()}">${section}</a>`;
        navList.insertBefore(li, navList.lastElementChild);
      });


      const resInventario = await fetch('http://localhost:3000/api/getInventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resInventario.ok) throw new Error("Errore nel caricamento dell'inventario");

      const inventario = await resInventario.json();
      console.log("Inventario:", inventario);
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

      // CARICA PRENOTAZIONI
      const resPrenotazioni = await fetch('http://localhost:3000/api/getOrdersByArtisanId', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

/*
      // Dashboard
      const dashboard = await (await fetch('/api/dashboard')).json();
      new Chart(document.getElementById('guadagniChart').getContext('2d'), {
        type: 'line',
        data: {
          labels: dashboard.mesi,
          datasets: [{
            label: 'Guadagni',
            data: dashboard.guadagni,
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
          labels: dashboard.settimana,
          datasets: [{
            label: 'Vendite',
            data: dashboard.vendite,
            backgroundColor: '#f5b400'
          }]
        },
        options: { responsive: true }
      });

      // Notifiche
      const notifiche = await (await fetch('/api/notifiche')).json();
      const notificheList = document.getElementById("notifiche-list");
      notificheList.innerHTML = "";
      notifiche.forEach(n => {
        const li = document.createElement("li");
        li.innerText = n.messaggio;
        notificheList.appendChild(li);
      });
*/
    } else {
      // CLIENTE

      // ORDINI
      const resOrdini = await fetch('http://localhost:3000/api/getOrdersByUserId', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const orderList = await resOrdini.json();

      console.log("ordini restituiti:", orderList);

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
          const tr = document.createElement("tr");

          const articoli = order.products.map(p => `
      <div style="margin-bottom: 0.5rem;">
        <strong>${p.product_name}</strong><br/>
        Quantità: ${p.quantity}<br/>
        €${Number(p.single_price).toFixed(2)}
      </div>
    `).join("");

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
