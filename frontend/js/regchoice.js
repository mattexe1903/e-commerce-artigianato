  async function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
  }

function selezionaAccount(tipo) {
  window.location.href = `regform.html?tipo=${encodeURIComponent(tipo)}`;
}