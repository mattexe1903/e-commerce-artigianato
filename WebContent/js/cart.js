document.addEventListener("DOMContentLoaded", () => {
    const cart = [
      { id: 1, name: "Felpa Gialla", info: "Taglia M, Cotone", price: 29.99, quantity: 2 },
      { id: 2, name: "Jeans Slim", info: "Taglia 32, Blu", price: 49.99, quantity: 1 }
    ];
  
    const cartItemsContainer = document.getElementById("cart-items");
    const summaryItems = document.getElementById("summary-items");
    const totalItemsSpan = document.getElementById("total-items");
    const itemsPriceSpan = document.getElementById("items-price");
    const totalPriceSpan = document.getElementById("total-price");
    const cartContent = document.getElementById("cart-content");
    const emptyCart = document.getElementById("empty-cart");
  
    const modal = document.getElementById("modal");
    const removeInput = document.getElementById("remove-quantity");
    const modalItemName = document.getElementById("modal-item-name");
  
    let selectedItem = null;
  
    function renderCart() {
      if (cart.length === 0) {
        cartContent.style.display = "none";
        emptyCart.style.display = "block";
        return;
      }
  
      cartContent.style.display = "flex";
      emptyCart.style.display = "none";
      cartItemsContainer.innerHTML = "";
      summaryItems.innerHTML = "";
  
      let totalItems = 0;
      let itemsTotal = 0;
  
      cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <span>${item.name}</span>
          <span>${item.info}</span>
          <span>€${item.price.toFixed(2)}</span>
          <span>${item.quantity}</span>
          <span><button onclick="openModal(${item.id})">🗑️</button></span>
        `;
        cartItemsContainer.appendChild(row);
  
        const summaryRow = document.createElement("p");
        summaryRow.textContent = `${item.name} x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}`;
        summaryItems.appendChild(summaryRow);
  
        totalItems += item.quantity;
        itemsTotal += item.price * item.quantity;
      });
  
      totalItemsSpan.textContent = totalItems;
      itemsPriceSpan.textContent = itemsTotal.toFixed(2);
      totalPriceSpan.textContent = (itemsTotal + 5.99).toFixed(2);
    }
  
    window.openModal = (id) => {
      selectedItem = cart.find(i => i.id === id);
      if (selectedItem) {
        modalItemName.textContent = `${selectedItem.name} (Disponibili: ${selectedItem.quantity})`;
        removeInput.max = selectedItem.quantity;
        removeInput.value = 1;
        modal.style.display = "flex";
      }
      errorMsg.style.display = "none";
    };
  
    window.closeModal = () => {
      modal.style.display = "none";
      selectedItem = null;
    };
  
    window.confirmPartialRemove = () => {
        const qtyToRemove = parseInt(removeInput.value, 10);
        const errorMsg = document.getElementById("modal-error");
      
        if (!selectedItem || isNaN(qtyToRemove) || qtyToRemove < 1) return;
      
        if (qtyToRemove > selectedItem.quantity) {
          errorMsg.style.display = "block";
          errorMsg.textContent = `Puoi rimuovere al massimo ${selectedItem.quantity} unità.`;
          return;
        }
      
        errorMsg.style.display = "none";
      
        selectedItem.quantity -= qtyToRemove;
        if (selectedItem.quantity === 0) {
          const index = cart.findIndex(i => i.id === selectedItem.id);
          if (index > -1) cart.splice(index, 1);
        }
      
        closeModal();
        renderCart();
      };      
  
    window.proceedOrder = () => {
      location.href = "payment.html";
    };
  
    renderCart();
  });
  