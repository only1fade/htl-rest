// --- Modal Logic ---
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const closeSignIn = document.getElementById('closeSignIn');
const closeSignUp = document.getElementById('closeSignUp');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const reserveNowBtn = document.getElementById('reserveNowBtn');
const addReservationBtn = document.getElementById('addReservationBtn');
const reservationModal = document.getElementById('reservationModal');
const closeReservation = document.getElementById('closeReservation');
const addOrderBtn = document.getElementById('addOrderBtn');
const orderModal = document.getElementById('orderModal');
const closeOrder = document.getElementById('closeOrder');
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');
const closeEditProfile = document.getElementById('closeEditProfile');

// --- Show/Hide Modals ---
signInBtn.onclick = () => signInModal.style.display = 'flex';
signUpBtn.onclick = () => signUpModal.style.display = 'flex';
closeSignIn.onclick = () => signInModal.style.display = 'none';
closeSignUp.onclick = () => signUpModal.style.display = 'none';
logoutBtn.onclick = logout;
profileBtn.onclick = () => { showProfile(); showSection('profileSection'); };
reserveNowBtn.onclick = () => reservationModal.style.display = 'flex';
addReservationBtn.onclick = () => reservationModal.style.display = 'flex';
closeReservation.onclick = () => reservationModal.style.display = 'none';
addOrderBtn.onclick = () => orderModal.style.display = 'flex';
closeOrder.onclick = () => orderModal.style.display = 'none';
editProfileBtn.onclick = () => editProfileModal.style.display = 'flex';
closeEditProfile.onclick = () => editProfileModal.style.display = 'none';

window.onclick = (e) => {
  if (e.target === signInModal) signInModal.style.display = 'none';
  if (e.target === signUpModal) signUpModal.style.display = 'none';
  if (e.target === reservationModal) reservationModal.style.display = 'none';
  if (e.target === orderModal) orderModal.style.display = 'none';
  if (e.target === editProfileModal) editProfileModal.style.display = 'none';
};

// --- Auth Forms ---
document.getElementById('signUpForm').onsubmit = async function(e) {
  e.preventDefault();
  const name = this.elements[0].value;
  const email = this.elements[1].value;
  const password = this.elements[2].value;
  const res = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Sign up successful! You can now sign in.');
    signUpModal.style.display = 'none';
  } else {
    alert(data.message || 'Sign up failed');
  }
};

document.getElementById('signInForm').onsubmit = async function(e) {
  e.preventDefault();
  const email = this.elements[0].value;
  const password = this.elements[1].value;
  const res = await fetch('http://localhost:5000/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    signInModal.style.display = 'none';
    onLogin();
  } else {
    alert(data.message || 'Sign in failed');
  }
};

function logout() {
  localStorage.removeItem('token');
  alert('Logged out!');
  onLogout();
}

// --- Section Show/Hide Logic ---
function showSection(sectionId) {
  ['menuSection', 'reservationsSection', 'ordersSection', 'profileSection'].forEach(id => {
    document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
  });
}

// --- On Login/Logout ---
function onLogin() {
  signInBtn.style.display = 'none';
  signUpBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
  profileBtn.style.display = 'inline-block';
  showMenu();
  showReservations();
  showOrders();
  showProfile();
  showSection('menuSection'); // Always show menu after login
}
function onLogout() {
  signInBtn.style.display = 'inline-block';
  signUpBtn.style.display = 'inline-block';
  logoutBtn.style.display = 'none';
  profileBtn.style.display = 'none';
  showSection(null);
}

// --- Menu ---
async function showMenu() {
  const res = await fetch('http://localhost:5000/api/menu');
  const items = await res.json();
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';
  items.forEach(item => {
    menuList.innerHTML += `
      <div class="menu-card">
        <img src="${item.image}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p class="price">$${item.price}</p>
        <button class="button-primary" onclick="orderDish('${item._id}')">Order</button>
      </div>
    `;
  });
  showSection('menuSection'); // Ensure menu section is visible
}
window.orderDish = function(id) {
  // Open the order modal and pre-select the dish (for now, just open the modal)
  orderModal.style.display = 'flex';
  // You can add logic here to pre-fill the order form with the selected dish
};

// --- Reservations ---
document.getElementById('reservationForm').onsubmit = async function(e) {
  e.preventDefault();
  const name = this.elements[0].value;
  const email = this.elements[1].value;
  const phone = this.elements[2].value;
  const date = this.elements[3].value;
  const time = this.elements[4].value;
  const partySize = this.elements[5].value;
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be signed in to make a reservation.');
    return;
  }
  const res = await fetch('http://localhost:5000/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ name, email, phone, date, time, partySize })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Reservation successful!');
    reservationModal.style.display = 'none';
    showReservations();
  } else {
    alert(data.message || 'Reservation failed');
  }
};

async function showReservations() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch('http://localhost:5000/api/reservations/my', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const reservations = await res.json();
  const list = document.getElementById('reservationsList');
  list.innerHTML = '';
  reservations.forEach(r => {
    list.innerHTML += `
      <div class="reservation-card">
        <h3>${r.name}</h3>
        <p>${r.date.split('T')[0]} at ${r.time}</p>
        <p>Party Size: ${r.partySize}</p>
        <button class="button-secondary" onclick="cancelReservation('${r._id}')">Cancel</button>
      </div>
    `;
  });
}
window.cancelReservation = async function(id) {
  const token = localStorage.getItem('token');
  if (!token) return;
  await fetch(`http://localhost:5000/api/reservations/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  showReservations();
};

// --- Orders ---
async function showOrders() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch('http://localhost:5000/api/orders/my', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const orders = await res.json();
  const list = document.getElementById('ordersList');
  list.innerHTML = '';
  orders.forEach(o => {
    list.innerHTML += `
      <div class="order-card">
        <h3>Order #${o._id.slice(-5)}</h3>
        <p>Status: ${o.status}</p>
        <p>Total: $${o.total}</p>
        <button class="button-secondary" onclick="deleteOrder('${o._id}')">Delete</button>
      </div>
    `;
  });
}
window.deleteOrder = async function(id) {
  const token = localStorage.getItem('token');
  if (!token) return;
  await fetch(`http://localhost:5000/api/orders/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  showOrders();
};

// --- Profile ---
async function showProfile() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch('http://localhost:5000/api/profile', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const data = await res.json();
  document.getElementById('profileInfo').innerHTML = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
  `;
}

// --- On Page Load: Check Login State ---
window.onload = function() {
  if (localStorage.getItem('token')) {
    onLogin();
  } else {
    onLogout();
  }
};

// Add event listeners for menu links in nav/footer
const menuLinks = document.querySelectorAll('a[href="#menuSection"]');
menuLinks.forEach(link => {
  link.onclick = (e) => {
    e.preventDefault();
    showMenu();
    showSection('menuSection');
  };
}); 