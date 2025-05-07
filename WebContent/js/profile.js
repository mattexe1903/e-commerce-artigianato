document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "homereg.html";
  });
  
  window.onload = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      console.log(token);
      console.log('sono dentro');
      fetch('http://localhost:3000/api/userInfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(async response => {
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || "Registrazione fallita. Controlla i dati.");
          }
          
          console.log('response', data);
          return data;
        })

      .then(async data => {
        const user = data.user;
        const ruolo = user.ruolo;
        const address = data.addresses;
  
        // Set UI generale
        document.getElementById("titolo-bentornato").innerText = `Benvenuto, ${user.user_name}`;
        document.getElementById("sidebar-title").innerText = ruolo === 3 ? "Lokal" : "Profilo";
  
        // Aggiungi sezioni extra per artigiano
        if (ruolo === 3) {
          document.getElementById("inventario").classList.remove("hidden");
          document.getElementById("prenotazioni").classList.remove("hidden");
          document.getElementById("dashboard").classList.remove("hidden");
  
          const navList = document.getElementById("nav-list");
          ["Inventario", "Prenotazioni", "Dashboard"].forEach((item, i) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#${item.toLowerCase()}">${item}</a>`;
            navList.insertBefore(li, navList.lastElementChild);
          });
        }
  
        // Mostra dati utente
        const datiUtente = document.getElementById("dati-utente");
        let indirizzo = "Indirizzo mancante";
        if (address && address.length > 0) {
          indirizzo = adresse.map(addr => `${addr.street}, ${addr.city}`).join(", ");
        }
        
        datiUtente.innerHTML = `
          <p><strong>Nome:</strong> ${user.user_name} ${user.surname}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Indirizzo:</strong> ${indirizzo}</p>
        `;
      })
      // Ordini
      const resOrdini = await fetch('/api/utente/ordini');
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
  
      // Preferiti
      const resPreferiti = await fetch('/api/utente/preferiti');
      const preferiti = await resPreferiti.json();
      const listaPreferiti = document.getElementById("lista-preferiti");
      preferiti.forEach(p => {
        const card = document.createElement("div");
        card.className = "prodotto";
        card.innerHTML = `
          <img src="${p.img}" alt="${p.nome}" />
          <p>${p.nome}</p>
          <p>€${p.prezzo}</p>
        `;
        card.onclick = () => window.location.href = `productsview.html?id=${p.id}`;
        listaPreferiti.appendChild(card);
      });
  
      if (ruolo === "artigiano") {
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