const btnEl = document.querySelector('.btn');
const cardEl = document.querySelector('.card');
const cardTitleEl = document.querySelector('.card-title');
const costValueEl = document.querySelector('.costsValue');
const cardTextEl = document.querySelector('.card-text');
const costsAmountEl = document.querySelector('.costsAmount');
const nameEl = document.querySelector('#name');
const priceEl = document.querySelector('#price');
const countEl = document.querySelector('#count');
const selectEl = document.querySelector('#selectCost');
const disableEl = document.querySelector('#selectCost').firstElementChild
  .innerHTML;
const tbodyEl = document.querySelector('tbody');

//LocalStorage
const productLocalStorage = JSON.parse(localStorage.getItem('products'));
let products =
  localStorage.getItem('products') !== null ? productLocalStorage : [];

//Function getDay Title(h2)
function getDay() {
  let date = new Date();
  let weekday = new Array(7);
  weekday[0] = 'Pazar';
  weekday[1] = 'Pazartesi';
  weekday[2] = 'Salı';
  weekday[3] = 'Çarşamba';
  weekday[4] = 'Perşembe';
  weekday[5] = 'Cuma';
  weekday[6] = 'Cumartesi';

  let day = weekday[date.getDay()];
  document.querySelector(
    'h2'
  ).innerHTML = `Bugünkü (${day}) Günlük Harcamaların`;
}

//Function Max Id
function lastId() {
  let max = 0;
  products.forEach((item) => {
    if (item.id > max) {
      max = item.id;
    }
  });
  return max;
}

//Function addProduct
function addProduct(e) {
  e.preventDefault();
  const product = {
    id: lastId() + 1,
    name: nameEl.value,
    price: priceEl.value,
    count: countEl.value,
    amount: parseInt(priceEl.value) * parseInt(countEl.value),
    cost: selectEl.value,
  };
  products.push(product);
  updatelocalStr();
  updateTable();
  clearInput();
  totalCosts(product.cost);
}

//Function Update LocalStorage
function updatelocalStr() {
  localStorage.setItem('products', JSON.stringify(products));
}

//Function Update Table
function updateTable() {
  tbodyEl.innerHTML = '';
  products.forEach((item) => {
    const tr = document.createElement('tr');
    const values = Object.values(item);
    values.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    //Price and count classList.add
    if (tr.childNodes[2].innerHTML < 20) {
      tr.childNodes[2].classList.add('red');
    } else {
      tr.childNodes[2].classList.add('green');
    }
    if (tr.childNodes[3].innerHTML < 10) {
      tr.childNodes[3].classList.add('red');
    } else {
      tr.childNodes[3].classList.add('green');
    }

    //Last child element
    const tdLast = document.createElement('td');
    tdLast.innerHTML = `<a onclick="deleteProduct(${item.id})"><i class="fas fa-trash-alt"></i></a>`;
    tr.appendChild(tdLast);
    tbodyEl.appendChild(tr);
  });
}

//Function Delete Product LocalStorage and Table
function deleteProduct(id) {
  let cost = {};
  products.forEach((item) => {
    if (item.id === id) {
      cost = item;
    }
  });
  products = products.filter((i) => i.id !== id);
  updatelocalStr();
  updateTable();
  totalCosts(cost.cost);
}

//Function totalCosts
function totalCosts(value) {
  const val = value;
  const costs = [];
  products.forEach((item) => {
    if (value === item.cost) {
      costs.push(item);
    }
  });
  calculateCost(costs, val);
}

//Function changeCost
function changeCost(e) {
  totalCosts(e.target.value);
  cardEl.style.display = 'block';
}

//Function Calculate total cost
function calculateCost(costs, value) {
  const totalCosts = costs.map((item) => item.amount);
  const calculateAmount = totalCosts.reduce((acc, item) => (acc += item), 0);
  costValueEl.innerHTML = `${value.toUpperCase()} Için`;
  cardTitleEl.appendChild(costValueEl);
  costsAmountEl.innerHTML = `Yapılan Toplam Harcama : <span>${calculateAmount} TL</span> `;
  cardTextEl.appendChild(costsAmountEl);
}

//Function Clear input value
function clearInput() {
  nameEl.value = '';
  priceEl.value = '';
  countEl.value = '';
  selectEl.value = disableEl;
}

//Event Listeners
document.getElementById('calculateTotalCost').onchange = changeCost;
btnEl.addEventListener('click', addProduct);
window.addEventListener('load', updateTable);
window.addEventListener('load', getDay);
