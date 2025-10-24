function getCart(){
  const user = JSON.parse(localStorage.getItem('loggedInUser')||'null');
  const key = user ? 'cart_'+user.username : 'cart_guest';
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function saveCart(cart){
  const user = JSON.parse(localStorage.getItem('loggedInUser')||'null');
  const key = user ? 'cart_'+user.username : 'cart_guest';
  localStorage.setItem(key, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId){
  const user = JSON.parse(localStorage.getItem('loggedInUser')||'null');
  if(!user){
    if(confirm('You must login to add to cart. Go to login?')) window.location='login.html';
    return;
  }
  let cart = getCart();
  const item = cart.find(i=>i.id===productId);
  if(item) item.qty += 1;
  else cart.push({id:productId, qty:1});
  saveCart(cart);
  alert('Added to cart');
}

function updateCartCount(){
  const el = document.getElementById('cart-count');
  if(!el) return;
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  el.textContent = count;
}

function renderCart(){
  const cart = getCart();
  const products = JSON.parse(localStorage.getItem('products')||'[]');
  const container = document.getElementById('cart-contents');
  if(!container) return;
  if(!cart.length){ container.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent='0'; return; }
  let total = 0;
  container.innerHTML = '<table class="table"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Action</th></tr></thead><tbody>' +
    cart.map(item=>{
      const p = products.find(x=>x.id===item.id) || {name:'[removed]', price:0};
      const line = p.price * item.qty;
      total += line;
      return `<tr>
        <td>${p.name}</td>
        <td><button onclick='changeQty("${item.id}", -1)'>-</button> ${item.qty} <button onclick='changeQty("${item.id}", 1)'>+</button></td>
        <td>₹${line}</td>
        <td><button onclick='removeItem("${item.id}")'>Remove</button></td>
      </tr>`;
    }).join('') + '</tbody></table>';
  document.getElementById('cart-total').textContent = total;
}

function changeQty(id, delta){
  let cart = getCart();
  const idx = cart.findIndex(i=>i.id===id);
  if(idx<0) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart(cart);
  renderCart();
}

function removeItem(id){
  let cart = getCart().filter(i=>i.id!==id);
  saveCart(cart);
  renderCart();
}