// Authentication: signup, login, requireLogin, logout
function logout(){
  localStorage.removeItem('loggedInUser');
  window.location = '/login.html';
}

document.getElementById('signupForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  if(users.find(u=>u.username===username)){
    alert('Username exists');
    return;
  }
  users.push({username, password, role:'user'});
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful');
  window.location = 'login.html';
});

document.getElementById('loginForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  console.log(users)
  const user = users.find(u=>u.username===username && u.password===password);
  if(!user){
    alert('Invalid credentials');
    return;
  }
  localStorage.setItem('loggedInUser', JSON.stringify(user));
  if (user.role === 'admin') {
  window.location = '/admin/dashboard.html';
} else {
  window.location = '/index.html';
}

});


function requireLogin(role=null){
  const relPath = window.location.pathname.includes('/admin/') ? '../' : './';
  const user = JSON.parse(localStorage.getItem('loggedInUser')||'null');
  if(!user){
    alert('Please login first');
    window.location = relPath + 'login.html';
    return;
  }
  if(role && user.role !== role){
    alert('Access denied');
    window.location = relPath + 'index.html';
  }
}