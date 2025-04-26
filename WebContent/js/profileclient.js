document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "homereg.html";
});

window.onload = async () => {
  try {
    // Recupera dati utente
    const resUtente = await fetch('/api/utente');
    if (!resUtente.ok) throw new Error("Errore nel recupero dati utente");
    const utente = await resUtente.json();

    const datiUtente = document.getElementById("dati-utente");
    datiUtente.innerHTML = `
      <p><strong>Nome:</strong> ${utente.nome} ${utente.cognome}</p>
      <p><strong>Email:</strong> ${utente.email}</p>
      <p><strong>Telefono:</strong> ${utente.telefono}</p>
    `;

    // Recupera ordini utente
    const resOrdini = await fetch('/api/utente/ordini');
    if (!resOrdini.ok) throw new Error("Errore nel recupero ordini");
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

    // Recupera prodotti preferiti
    const resPreferiti = await fetch('/api/utente/preferiti');
    if (!resPreferiti.ok) throw new Error("Errore nel recupero preferiti");
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
      card.onclick = () => vaiAllaPaginaProdotto(p.id);
      listaPreferiti.appendChild(card);
    });

  } catch (error) {
    console.error("Errore:", error);
    alert("C'è stato un problema nel caricamento dei dati. Riprova più tardi.");
  }
};

function vaiAllaPaginaProdotto(idProdotto) {
  window.location.href = `productsview.html?id=${idProdotto}`;
}
