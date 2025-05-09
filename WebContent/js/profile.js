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

      /* Carica inventario
      const inventario = await (await fetch('/api/inventario')).json();
      const inventarioList = document.getElementById("inventario-list");
      inventarioList.innerHTML = "";
      inventario.forEach(i => {
        const div = document.createElement("div");
        div.classList.add("prodotto");
        div.innerHTML = `
          <p><strong>${i.nome}</strong></p>
          <p>Prezzo: €${i.prezzo}</p>
        `;
        inventarioList.appendChild(div);
      });*/

      document.getElementById("aggiungi-prodotto-btn").addEventListener("click", () => {
        window.location.href = "productsadd.html";
      });

      // Carica prenotazioni
      const prenotazioni = await (await fetch('/api/prenotazioni')).json();
      const prenotazioniList = document.getElementById("prenotazioni-list");
      prenotazioniList.innerHTML = "";
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
      notificheList.innerHTML = "";
      notifiche.forEach(n => {
        const li = document.createElement("li");
        li.innerText = n.messaggio;
        notificheList.appendChild(li);
      });

    } else {
      // CLIENTE
      
      // ORDINI (se servono, decommenta)
      /*
      const resOrdini = await fetch('/api/utente/ordini');
      if (!resOrdini.ok) throw new Error("Errore nel caricamento degli ordini.");
      const ordini = await resOrdini.json();
      const corpoTabella = document.querySelector("#tabella-ordini tbody");
      ordini.forEach(o => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${o.data}</td>
          <td>${o.numero}</td>
          <td>${o.prezzo}</td>
          <td>${o.articoli}</td>
          <td>${o.stato}</td>
        `;
        corpoTabella.appendChild(row);
      });
      */

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
