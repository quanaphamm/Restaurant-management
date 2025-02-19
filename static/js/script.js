document.addEventListener("DOMContentLoaded", function () {
    const quantityInput = document.getElementById("quantity");
    const decreaseBtn = document.getElementById("decrease");
    const increaseBtn = document.getElementById("increase");
    const addItemBtn = document.getElementById("add-item");
    const dishSelect = document.getElementById("dish");
    const orderList = document.getElementById("order-list");
    const totalPrice = document.getElementById("total-price");
    const continueBtn = document.querySelector(".continue-btn");

    let totalOrderPrice = 0;
    const taxRate = 0.09;
    let orderItems = [];

    function updateTotal() {
        let subtotal = totalOrderPrice;
        let total = subtotal + (subtotal * taxRate);
        totalPrice.textContent = `$${total.toFixed(2)}`;
    }

    function updateQuantity(change) {
        let quantity = parseInt(quantityInput.value) + change;
        if (quantity < 1) {
            quantity = 1;
        }
        quantityInput.value = quantity;
        decreaseBtn.disabled = quantity === 1;
    }

    function addItem() {
        let selectedOption = dishSelect.options[dishSelect.selectedIndex];
        let dishName = selectedOption.value;
        let dishPrice = parseFloat(selectedOption.getAttribute("data-price"));

        if (!dishName || isNaN(dishPrice) || dishPrice === 0) {
            alert("Please select a valid dish.");
            return;
        }

        let quantity = parseInt(quantityInput.value);

        let existingItem = orderItems.find(item => item.name === dishName);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice += dishPrice * quantity;
        } else {
            orderItems.push({
                name: dishName,
                quantity: quantity,
                pricePerUnit: dishPrice,
                totalPrice: dishPrice * quantity
            });
        }

        updateOrderList();
        totalOrderPrice += dishPrice * quantity;
        updateTotal();
    }

    function removeItem(dishName) {
        let itemIndex = orderItems.findIndex(item => item.name === dishName);
        if (itemIndex > -1) {
            let removeQuantity = parseInt(document.getElementById(`remove-qty-${dishName}`).value);

            if (removeQuantity >= orderItems[itemIndex].quantity) {
                totalOrderPrice -= orderItems[itemIndex].totalPrice;
                orderItems.splice(itemIndex, 1);
            } else {
                orderItems[itemIndex].quantity -= removeQuantity;
                orderItems[itemIndex].totalPrice -= orderItems[itemIndex].pricePerUnit * removeQuantity;
                totalOrderPrice -= orderItems[itemIndex].pricePerUnit * removeQuantity;
            }
        }

        updateOrderList();
        updateTotal();
    }

    function updateOrderList() {
        orderList.innerHTML = "";
        orderItems.forEach(item => {
            let li = document.createElement("li");
            li.setAttribute("data-dish", item.name);

            li.innerHTML = `
                <span>${item.name} x${item.quantity} - $${item.totalPrice.toFixed(2)}</span>
                <span class="order-quantity">Qty: ${item.quantity}</span>
                <input type="number" id="remove-qty-${item.name}" value="1" min="1" max="${item.quantity}" class="remove-qty">
                <button class="remove-btn" data-dish="${item.name}">Remove</button>
            `;

            orderList.appendChild(li);
        });

        attachRemoveEventListeners();
    }

    function attachRemoveEventListeners() {
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                let dishName = this.getAttribute("data-dish");
                removeItem(dishName);
            });
        });
    }

    dishSelect.addEventListener("change", function () {
        let selectedOption = dishSelect.options[dishSelect.selectedIndex];
        let pricePerItem = parseFloat(selectedOption.getAttribute("data-price")) || 0;
    });

    increaseBtn.addEventListener("click", () => updateQuantity(1));
    decreaseBtn.addEventListener("click", () => updateQuantity(-1));
    addItemBtn.addEventListener("click", addItem);

    // ✅ Redirect to Customer TOGO Page (Fixes NaN issue)
    continueBtn.addEventListener("click", function() {
        if (orderItems.length === 0) {
            alert("Your cart is empty. Please add items before continuing.");
            return;
        }

        localStorage.setItem("orderList", JSON.stringify(orderItems));
        localStorage.setItem("totalPrice", totalOrderPrice.toFixed(2));

        window.location.href = "/customer_togo";
    });

    updateTotal();
});
