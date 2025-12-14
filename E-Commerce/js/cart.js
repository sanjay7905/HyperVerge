
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("loggedInUser") || "null");
}


function getCart() {
  const user = getCurrentUser();
  const key = user ? "cart_" + user.username : "cart_guest";
  return JSON.parse(localStorage.getItem(key) || "[]");
}


function saveCart(cart) {
  const user = getCurrentUser();
  const key = user ? "cart_" + user.username : "cart_guest";
  localStorage.setItem(key, JSON.stringify(cart));
  updateCartCount();
}


function addToCart(productId) {
  const user = getCurrentUser();
  if (!user) {
    if (confirm("You must login to add to cart. Go to login?")) {
      window.location = "login.html";
    }
    return;
  }

  let cart = getCart();
  const item = cart.find((i) => i.id == productId);
  if (item) item.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
  alert("Added to cart!");
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  el.textContent = count;
}

async function loadAllProducts() {
  let products = JSON.parse(localStorage.getItem("products") || "[]");


  try {
    const res = await fetch("./mock/products.json");
    if (res.ok) {
      const jsonProducts = await res.json();
      const ids = new Set(products.map((p) => p.id));
      products = [...products, ...jsonProducts.filter((p) => !ids.has(p.id))];
    } else {
      console.warn("Could not fetch products.json");
    }
  } catch (e) {
    console.warn("Fetch error:", e);
  }

  if (!products.length) {
    products = [
      {
        id: 1,
        name: "T-Shirt",
        price: 499,
        image: "img/tshirt.jpg",
        desc: "Soft cotton unisex t-shirt.",
      },
    ];
  }

  return products;
}


async function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-contents");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  if (!cart.length) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    if (totalEl) totalEl.textContent = "₹0";
    return;
  }

  const products = await loadAllProducts();

  let total = 0;
  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${cart
          .map((item) => {
            const p = products.find((x) => x.id == item.id);
            if (!p) return "";
            const line = p.price * item.qty;
            total += line;
            return `
              <tr>
                <td><img src="${p.image}" width="60" height="60" style="object-fit:cover"></td>
                <td>${p.name}</td>
                <td>
                  <button onclick="changeQty(${item.id}, -1)">−</button>
                  ${item.qty}
                  <button onclick="changeQty(${item.id}, 1)">+</button>
                </td>
                <td>₹${line}</td>
                <td><button onclick="removeItem(${item.id})">Remove</button></td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

  if (totalEl) totalEl.textContent =  total;
}

function changeQty(id, delta) {
  let cart = getCart();
  const idx = cart.findIndex((i) => i.id == id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
}


function removeItem(id) {
  let cart = getCart().filter((i) => i.id != id);
  saveCart(cart);
  renderCart();
}


document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (document.getElementById("cart-contents")) renderCart();
});
