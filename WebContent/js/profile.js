document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "homereg.html";
});

window.onload = async () => {
  try {
    const tokenRaw = localStorage.getItem("token");
    const token = JSON.parse(tokenRaw);

    // Caricamento dati utente
    const resUser = await fetch('http://localhost:3000/api/userInfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!resUser.ok) throw new Error("Errore nel caricamento dei dati utente.");

    const data = await resUser.json();
    const user = data.user;
    const ruolo = user.ruolo;
    const address = data.addresses || [];

    // UI utente
    document.getElementById("titolo-bentornato").innerText = `Benvenuto, ${user.user_name}`;
    document.getElementById("sidebar-title").innerText = ruolo === 3 ? "Lokal" : "Profilo";

    // Dati utente
    const indirizzo = address.length
      ? address.map(a => `${a.street_address}, ${a.city}, ${a.cap}, ${a.province}, ${a.country}`).join(" | ")
      : "Indirizzo mancante";

    document.getElementById("dati-utente").innerHTML = `
      <p><strong>Nome:</strong> ${user.user_name} ${user.surname}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Indirizzo:</strong> ${indirizzo}</p>
    `;

    //TODO: Caricamento ordini
    
    const resOrdini = await fetch('http://localhost:3000/api/getOrdersByUserId', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const orderList = await resOrdini.json();

    console.log("ordini restituiti:", orderList);


    // ✅ Caricamento preferiti (inline)
    const res = await fetch('http://localhost:3000/api/favourites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

    // Se artigiano, carica sezioni extra
    if (ruolo === 3) {
      document.getElementById("inventario").classList.remove("hidden");
      document.getElementById("prenotazioni").classList.remove("hidden");
      document.getElementById("dashboard").classList.remove("hidden");

      const navList = document.getElementById("nav-list");
      ["Inventario", "Prenotazioni", "Dashboard"].forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${item.toLowerCase()}">${item}</a>`;
        navList.insertBefore(li, navList.lastElementChild);
      });

      // Inventario
      const inventario = await (await fetch('/api/inventario')).json();
      const inventarioList = document.getElementById("inventario-list");
      inventario.forEach(i => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><strong>${i.nome}</strong></p>
          <p>Prezzo: €${i.prezzo}</p>
        `;
        inventarioList.appendChild(div);
      });

      document.getElementById("aggiungi-prodotto-btn").addEventListener("click", () => {
        window.location.href = "productsadd.html";
      });

      // Prenotazioni
      const prenotazioni = await (await fetch('/api/prenotazioni')).json();
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
      notifiche.forEach(n => {
        const li = document.createElement("li");
        li.innerText = n.messaggio;
        notificheList.appendChild(li);
      });
    }

  } catch (error) {
    console.error("Errore:", error);
    alert("C'è stato un errore nel caricamento del profilo.");
  }
};
