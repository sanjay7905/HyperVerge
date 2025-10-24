function getProducts(){
  return JSON.parse(localStorage.getItem('products')||'[]');
}

function saveProducts(products){
  localStorage.setItem('products', JSON.stringify(products));
}


function renderProducts(){
  const el = document.getElementById('products');
  const products = getProducts();
  if(!el) return;
  el.innerHTML = products.map(p=>`
    <div class="card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <p>${p.desc||''}</p>
      <button class="btn small" onclick='addToCart("${p.id}")'>Add to cart</button>
    </div>
  `).join('') || '<p>No products</p>';
  updateCartCount();
}


function renderAdminProducts(){
  const tbody = document.querySelector('#product-table tbody');
  if(!tbody) return;
  const products = getProducts();
  tbody.innerHTML = products.map(p=>`
    <tr>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      <td>
        <a href="product-form.html?edit=${p.id}">Edit</a> |
        <a href="#" onclick='deleteProduct("${p.id}")'>Delete</a>
      </td>
    </tr>
  `).join('');
}


function initProductForm(){
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  if(editId){
    document.getElementById('form-title').textContent = 'Edit Product';
    const prod = getProducts().find(p=>p.id===editId);
    if(prod){
      document.getElementById('pid').value = prod.id;
      document.getElementById('name').value = prod.name;
      document.getElementById('price').value = prod.price;
      document.getElementById('image').value = prod.image;
      document.getElementById('desc').value = prod.desc;
    }
  }
  document.getElementById('productForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const id = document.getElementById('pid').value || ('p'+Date.now());
    const name = document.getElementById('name').value.trim();
    const price = Number(document.getElementById('price').value);
    const image = document.getElementById('image').value.trim() || 'https://via.placeholder.com/200x150?text=Product';
    const desc = document.getElementById('desc').value.trim();
    let products = getProducts();
    const idx = products.findIndex(p=>p.id===id);
    const obj = {id,name,price,image,desc};
    if(idx>=0) products[idx]=obj; else products.push(obj);
    saveProducts(products);
    window.location = 'dashboard.html';
  });
}

function deleteProduct(id){
  if(!confirm('Delete product?')) return;
  let products = getProducts().filter(p=>p.id!==id);
  saveProducts(products);
  renderAdminProducts();
}