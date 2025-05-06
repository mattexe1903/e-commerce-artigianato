window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    if (productId) {
      try {
        const response = await fetch(`/api/prodotti/${productId}`);
        if (response.ok) {
          const prodotto = await response.json();
          document.getElementById('product-img').src = prodotto.imgUrl;
          document.getElementById('product-name').innerText = prodotto.nome;
          document.getElementById('product-category').innerText = prodotto.categoria;
          document.getElementById('product-description-text').innerText = prodotto.descrizione;
          document.getElementById('product-price').innerText = prodotto.prezzo;
          document.getElementById('product-quantity').innerText = prodotto.quantita;
        } else {
          console.error('Errore nel caricamento del prodotto.');
        }
      } catch (error) {
        console.error('Errore di rete:', error);
      }
    }
  };
  
  function enableEdit(id) {
    const element = document.getElementById(id);
  
    if (element.tagName === "SPAN" || element.tagName === "H2" || element.tagName === "P") {
      element.contentEditable = "true";
      element.classList.add('editing');
    }
  
    const parent = element.closest('.editable-field');
    const editBtn = parent.querySelector('.edit-btn');
    const saveBtn = parent.querySelector('.save-btn');
  
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
  }
  
  async function saveEdit(id) {
    const element = document.getElementById(id);
    element.contentEditable = "false";
    element.classList.remove('editing');
  
    let newValue = element.innerText.trim();
  
    const parent = element.closest('.editable-field');
    const editBtn = parent.querySelector('.edit-btn');
    const saveBtn = parent.querySelector('.save-btn');
  
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
  
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) return;
  
    try {
      const body = { field: id, value: newValue };
  
      const response = await fetch(`/api/prodotti/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        console.error('Errore durante il salvataggio.');
      } else {
        console.log('Modifica salvata.');
      }
    } catch (error) {
      console.error('Errore di rete:', error);
    }
  }
  