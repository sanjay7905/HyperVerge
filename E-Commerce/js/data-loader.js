
(async function(){
  if(!localStorage.getItem('products')){
    try{
      const res = await fetch('mock/products.json');
      const data = await res.json();
      localStorage.setItem('products', JSON.stringify(data));
      console.log('Products loaded to localStorage');
    }catch(e){
      console.warn('Could not load mock products', e);
    }
  }

  let users = JSON.parse(localStorage.getItem('users')||'[]');
  if(!users.find(u=>u.username==='admin')){
    users.push({username:'admin', password:'admin123', role:'admin'});
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Admin user created: admin/admin123');
  }
})();