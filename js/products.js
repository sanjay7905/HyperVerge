
async function getAllProducts(){ 
    const mock = JSON.parse(localStorage.getItem('mock_products')||'[]'); 
    const local = JSON.parse(localStorage.getItem('products')||'[]'); 
const map = new Map(); mock.forEach(p=>map.set(p.id,p)); 
local.forEach(p=>map.set(p.id,p)); 
return Array.from(map.values()); }
window.getAllProducts = getAllProducts;
async function renderProducts(){ 
    const products=await getAllProducts(); 
    const container=document.getElementById('products')||document.getElementById('product-list'); 
    if(!container) return; container.innerHTML=''; 
    products.forEach(p=>{ container.innerHTML+=`<div class="product-card card"><a href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}"></a>
        <h3>${p.name}</h3>
        <p>${p.desc||''}</p>
        <p><strong>₹${p.price}</strong></p>
        <div style="display:flex;gap:8px;justify-content:center">
        <button onclick="addToCart(${p.id})">Add to Cart</button
        ><a href="product.html?id=${p.id}">
        <button>View</button></a>
        </div>
        </div>` }); }
async function renderProductDetail(){ 
    const q=new URLSearchParams(location.search); 
    const id=Number(q.get('id')); 
    if(!id) return; 
    const products=await getAllProducts(); 
    const p=products.find(x=>x.id===id); 
    const el=document.getElementById('product-detail'); 
    if(!p){ el.innerHTML='<p>Product not found</p>'; 
        return;} el.innerHTML=`<div class="card">
        <img src="${p.image}" alt="${p.name}" style="max-width:360px"><h2>${p.name}</h2>
        <p>${p.desc}</p><p><strong>₹${p.price}</strong></p>
        <button onclick="addToCart(${p.id})">Add to Cart</button></div>`;} 
        if(document.getElementById('products')) renderProducts(); 
        if(document.getElementById('product-list')) renderProducts(); 
        if(document.getElementById('product-detail')) renderProductDetail();