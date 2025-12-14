// auth.js
function logout(){ 
  localStorage.removeItem('loggedInUser'); 
  const rel=window.location.pathname.includes('/admin/')?'../':'./'; 
  window.location=rel+'login.html'; 
}
document.getElementById('signupForm')?.addEventListener('submit', e=>{ 
  e.preventDefault(); 
  const username=document.getElementById('username').value.trim(); 
  const password=document.getElementById('password').value.trim(); 
  let users=JSON.parse(localStorage.getItem('users')||'[]'); 
  if(users.find(u=>u.username===username)){ 
    alert('Username exists'); return;
  } 
  users.push({username,password,role:'user'}); 
  localStorage.setItem('users',JSON.stringify(users)); alert('Signup success'); window.location='login.html'; });
document.getElementById('loginForm')?.addEventListener('submit', e=>{ e.preventDefault(); const username=document.getElementById('username').value.trim(); const password=document.getElementById('password').value.trim(); let users=JSON.parse(localStorage.getItem('users')||'[]'); const user=users.find(u=>u.username===username && u.password===password); if(!user){ alert('Invalid credentials'); return;} localStorage.setItem('loggedInUser',JSON.stringify(user)); if(window.location.pathname.includes('/admin/')){ if(user.role==='admin') window.location='dashboard.html'; else window.location='../index.html'; } else { if(user.role==='admin') window.location='admin/dashboard.html'; else window.location='index.html'; } });
function requireLogin(role=null){ const rel=window.location.pathname.includes('/admin/')?'../':'./'; const user=JSON.parse(localStorage.getItem('loggedInUser')||'null'); if(!user){ alert('Please login'); window.location=rel+'login.html'; return false;} if(role && user.role!==role){ alert('Access denied'); window.location=rel+'index.html'; return false;} return true; }
(function initAdmin() {
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminExists = users.some(u => u.username === 'admin' && u.role === 'admin');
  if (!adminExists) {
    users.push({ username: 'admin', password: 'admin123', role: 'admin' });
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Default admin created: admin / admin123');
  }
})();