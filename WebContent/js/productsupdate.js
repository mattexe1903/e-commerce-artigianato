window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const product = await response.json();

        document.getElementById('product-img').src = product.photo;
        document.getElementById('product-name').innerText = product.product_name;
        document.getElementById('product-description-text').innerText = product.photo_description;
        document.getElementById('product-price').innerText = product.price;
        document.getElementById('product-quantity').innerText = product.quantity;
      } else {
        console.error('Errore nel caricamento del prodotto.');
      }
    } catch (error) {
      console.error('Errore di rete:', error);
    }
  }
};

// Abilita la modifica di un campo
function enableEdit(id) {
  const element = document.getElementById(id);
  if (["SPAN", "H2", "P"].includes(element.tagName)) {
    element.contentEditable = "true";
    element.classList.add('editing');
  }

  const parent = element.closest('.editable-field');
  parent.querySelector('.edit-btn').style.display = 'none';
  parent.querySelector('.save-btn').style.display = 'inline-block';
}

// Salva la modifica del campo testuale
async function saveEdit(id) {
  const element = document.getElementById(id);
  const newValue = element.innerText.trim();
  element.contentEditable = "false";
  element.classList.remove('editing');

  const parent = element.closest('.editable-field');
  parent.querySelector('.edit-btn').style.display = 'inline-block';
  parent.querySelector('.save-btn').style.display = 'none';

  const productId = new URLSearchParams(window.location.search).get('id');
  if (!productId) return;

  const data = {};
  if (id === 'product-name') data.product_name = newValue;
  if (id === 'product-description-text') data.photo_description = newValue;
  if (id === 'product-price') data.price = parseFloat(newValue);
  if (id === 'product-quantity') data.quantity = parseInt(newValue);

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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

// Upload immagine e aggiornamento
document.getElementById("image-upload").addEventListener("change", async function () {
  const file = this.files[0];
  const productId = new URLSearchParams(window.location.search).get('id');

  if (!file || !productId) return;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const response = await fetch(`/api/products/${productId}/photo`, {
      method: 'PATCH',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("product-img").src = data.photo;
      alert("Immagine aggiornata con successo!");
    } else {
      alert("Errore durante l'aggiornamento immagine");
    }
  } catch (error) {
    console.error("Errore di rete:", error);
  }
});
