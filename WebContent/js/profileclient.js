document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "homereg.html";
  });
  
  const userId = 123; // Placeholder, verrà preso dal sistema di login

  const userString = localStorage.getItem("user");

  if (!userString) {
    console.error("Nessun utente trovato nel localStorage");
    return;
  }

  const user = JSON.parse(userString);
  
  const datiUtente = document.getElementById("dati-utente");
  datiUtente.innerHTML = `
    <p><strong>Nome:</strong> ${user.nome} ${user.cognome}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Telefono:</strong> ${"TO-DO"}</p>
  `;
  
  // Simulazione ordini
  const ordini = [
    { data: "2024-12-01", numero: "ORD123", prezzo: "59.90€", articoli: 3, stato: "Consegnato" },
    { data: "2025-01-15", numero: "ORD124", prezzo: "29.99€", articoli: 1, stato: "In spedizione" }
  ];
  
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
  
  // Simulazione preferiti
  const preferiti = [
    { id: 101, nome: "Trapano Bosch", prezzo: "89.99€", img: "https://via.placeholder.com/150" },
    { id: 102, nome: "Cacciavite Elettrico", prezzo: "19.99€", img: "https://via.placeholder.com/150" }
  ];
  
  const listaPreferiti = document.getElementById("lista-preferiti");
  preferiti.forEach(p => {
    const card = document.createElement("div");
    card.className = "prodotto";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nome}" />
      <p>${p.nome}</p>
      <p>${p.prezzo}</p>
    `;
    card.onclick = () => vaiAllaPaginaProdotto(p.id);
    listaPreferiti.appendChild(card);
  });
  
  // Funzione di reindirizzamento
  function vaiAllaPaginaProdotto(idProdotto) {
    window.location.href = `productsview.html?id=${idProdotto}&user=${userId}`;
  }
  