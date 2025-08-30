let purchaseList = []; // Array to store selected items
let subtotal = 0; // Subtotal amount

// Add event listener for the "Add Pet" button
document.getElementById('add-button').addEventListener('click', () => {
    const petName = document.getElementById('pet-name').value;
    const petPrice = parseFloat(document.getElementById('pet-price').value);
    const petStock = parseInt(document.getElementById('pet-stock').value);

    if (!petName || petPrice <= 0 || petStock <= 0) {
        alert('Please enter valid pet details.');
        return;
    }

    // Add pet to Available Pets
    const availablePetsContainer = document.querySelector('.pet-box');
    const petHTML = `
        <div class="pet-item" data-name="${petName}" data-stock="${petStock}">
            <p class="pet-name">${petName}</p>
            <p class="pet-price">Price: ${petPrice} Pesos</p>
            <p class="pet-stock">Stock: <span>${petStock}</span></p>
            <button class="add-pet-button" data-name="${petName}" data-price="${petPrice}" data-stock="${petStock}">Add</button>
        </div>
    `;
    availablePetsContainer.innerHTML += petHTML;

    // Add pet to Pet Inventory table
    const petInventoryTable = document.querySelector('.inventory-table tbody');
    const inventoryRow = `
    <tr data-name="${petName}" data-stock="${petStock}">
        <td>${petName}</td>
        <td>${petPrice} Pesos</td>
        <td class="pet-stock">${petStock}</td>
        <td>
            <button class="restock-button">🔄</button>
            <button class="delete-button">🗑️</button>
        </td>
    </tr>
`;
    petInventoryTable.innerHTML += inventoryRow;

    // Clear input fields
    document.getElementById('pet-name').value = '';
    document.getElementById('pet-price').value = '';
    document.getElementById('pet-stock').value = '';
});
// Listen for clicks inside the Pet Inventory table
document.querySelector('.inventory-table tbody').addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    const petName = row.getAttribute('data-name');

    // Handle Restock button
    if (e.target.classList.contains('restock-button')) {
        let addAmount = parseInt(prompt(`Enter how many to restock for ${petName}:`, "1"));
        if (isNaN(addAmount) || addAmount <= 0) return;

        // Update stock in inventory table
        const stockCell = row.querySelector('.pet-stock');
        let currentStock = parseInt(stockCell.textContent);
        currentStock += addAmount;
        stockCell.textContent = currentStock;

        // Update stock in Available Pets section
        const petItem = document.querySelector(`.pet-item[data-name="${petName}"]`);
        if (petItem) {
            const stockSpan = petItem.querySelector('.pet-stock span');
            stockSpan.textContent = currentStock;

            // Re-enable button if it was disabled
            const addBtn = petItem.querySelector('.add-pet-button');
            addBtn.disabled = false;
            addBtn.textContent = "Add";
        }
    }
});


// Add event listener for dynamically added "Add" buttons in Available Pets
document.querySelector('.pet-box').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-pet-button')) {
        const petName = e.target.getAttribute('data-name');
        const petPrice = parseFloat(e.target.getAttribute('data-price'));
        const petItem = document.querySelector(`.pet-item[data-name="${petName}"]`);
        const stockElement = petItem.querySelector('.pet-stock span');
        let currentStock = parseInt(stockElement.textContent);

        if (currentStock > 0) {
            // Add item to purchase list
            purchaseList.push({ name: petName, price: petPrice });
            updateSummary();

            // Decrement stock
            currentStock -= 1;
            stockElement.textContent = currentStock;

            // Update stock in Pet Inventory table
            const inventoryRow = document.querySelector(`.inventory-table tbody tr[data-name="${petName}"]`);
            if (inventoryRow) {
                const inventoryStockElement = inventoryRow.querySelector('.pet-stock');
                inventoryStockElement.textContent = currentStock;
            }

            // Disable button if stock reaches zero
            if (currentStock === 0) {
                e.target.disabled = true;
                e.target.textContent = 'Out of Stock';
            }
        } else {
            alert(`${petName} is out of stock!`);
        }
    }
});

// Update the Summary & Payment section
function updateSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const discountElement = document.getElementById('discount'); // Now an input field
    const discountInput = parseFloat(discountElement.value) || 0;

    // Calculate subtotal
    subtotal = purchaseList.reduce((sum, item) => sum + item.price, 0);
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Calculate total
    const total = subtotal - discountInput;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Generate receipt when "Generate Receipt" is pressed
document.getElementById('generate-receipt-button').addEventListener('click', () => {
    const gcashName = document.getElementById('gcash-name').value || 'N/A';
    const gcashNumber = document.getElementById('gcash-number').value || 'N/A';

    const receiptContent = `
        <h3>Receipt</h3>
        ${purchaseList
            .map((item) => `<p>${item.name} - $${item.price.toFixed(2)}</p>`)
            .join('')}
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Discount: ${document.getElementById('discount').value || 0}</p>
        <p><strong>Total: ${document.getElementById('total').textContent}</strong></p>
        <p>G-Cash Name: ${gcashName}</p>
        <p>G-Cash Number: ${gcashNumber}</p>
    `;

    let receiptBox = document.querySelector('.receipt-box');
    if (!receiptBox) {
        receiptBox = document.createElement('div');
        receiptBox.classList.add('receipt-box');
        document.querySelector('.right').appendChild(receiptBox);
    }
    receiptBox.innerHTML = receiptContent;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Receipt';
    copyButton.classList.add('copy-receipt-button');
    receiptBox.appendChild(copyButton);

    // Copy receipt functionality
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(receiptBox.innerText).then(() => {
            alert('Receipt copied to clipboard!');
        });
    });

    // Clear purchase list
    purchaseList = [];
    updateSummary();
}); 
{
    savedPets.forEach(pet => {
        // Available Pets
        const petHTML = `
            <div class="pet-item" data-name="${pet.name}" data-stock="${pet.stock}">
                <p class="pet-name">${pet.name}</p>
                <p class="pet-price">Price: ${pet.price} Pesos</p>
                <p class="pet-stock">Stock: <span>${pet.stock}</span></p>
                <button class="add-pet-button" data-name="${pet.name}" data-price="${pet.price}" data-stock="${pet.stock}">
                    ${pet.stock > 0 ? "Add" : "Out of Stock"}
                </button>
            </div>
        `;
        availablePetsContainer.innerHTML += petHTML;

        // Inventory Table
        const inventoryRow = `
            <tr data-name="${pet.name}" data-stock="${pet.stock}">
                <td>${pet.name}</td>
                <td>${pet.price} Pesos</td>
                <td class="pet-stock">${pet.stock}</td>
                <td>
                    <button class="restock-button">🔄</button>
                    <button class="delete-button">🗑️</button>
                </td>
            </tr>
        `;
        petInventoryTable.innerHTML += inventoryRow;
    });
}

// Recalculate when discount input changes
document.getElementById('discount').addEventListener('input', updateSummary);

const socket = io();

function displayPet(pet) {
  const div = document.createElement("div");
  div.classList.add("pet-item");
  div.setAttribute("data-name", pet.name);

  div.innerHTML = `
    <p class="pet-name" style="font-weight:bold; font-size:20px;">${pet.name}</p>
    <p>Price: ${pet.price} Pesos</p>
    <p>Stock: <span>${pet.stock}</span></p>
    <button class="delete-button" data-name="${pet.name}">Delete</button>
    <button class="restock-button" data-name="${pet.name}">Restock</button>
  `;

  document.querySelector(".pet-box").appendChild(div);
}

socket.on("initialPets", (allPets) => {
  document.querySelector(".pet-box").innerHTML = "";
  allPets.forEach(displayPet);
});

socket.on("newPet", (pet) => {
  displayPet(pet);
});

socket.on("deletePet", (name) => {
  document.querySelector(`[data-name="${name}"]`)?.remove();
});

socket.on("restockPet", ({ name, newStock }) => {
  const el = document.querySelector(`[data-name="${name}"] span`);
  if (el) el.textContent = newStock;
});

document.getElementById("add-button").addEventListener("click", () => {
  const name = document.getElementById("pet-name").value.trim();
  const price = document.getElementById("pet-price").value.trim();
  const stock = document.getElementById("pet-stock").value.trim();

  if (name && price && stock) {
    socket.emit("addPet", { name, price, stock });
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    const name = e.target.dataset.name;
    socket.emit("deletePet", name);
  }
  if (e.target.classList.contains("restock-button")) {
    const name = e.target.dataset.name;
    const newStock = prompt("Enter new stock:");
    if (newStock !== null) {
      socket.emit("restockPet", { name, newStock });
    }
  }
});


