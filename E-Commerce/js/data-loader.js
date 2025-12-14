(async function(){ try{ const res=await fetch('mock/products.json');
     const mock=await res.json();
     let existing=JSON.parse(localStorage.getItem('products')||'[]'); 
const merged = [...mock]; 
localStorage.setItem('mock_products', JSON.stringify(mock));
if(!existing.length) localStorage.setItem('products', JSON.stringify([])); 
}
catch(e){ 
    console.warn('mock load failed',e); 
} })();