// LOGIN / REGISTER
function register() {
let email = regEmail.value;
let pass = regPass.value;

localStorage.setItem(email, JSON.stringify({email, pass}));
regMsg.innerText="Registered!";
}

function login() {
let user = JSON.parse(localStorage.getItem(loginEmail.value));

if(user && user.pass===loginPass.value){
localStorage.setItem("loggedInUser", user.email);
loginMsg.innerText="Login success!";
} else {
loginMsg.innerText="Invalid!";
}
}

// ADD CART
function addToCart(name, price){
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let item = cart.find(i=>i.name===name);
if(item) item.qty++;
else cart.push({name,price,qty:1});

localStorage.setItem("cart", JSON.stringify(cart));
alert("Added!");
}

// LOAD CART
function loadCart(){
let cart = JSON.parse(localStorage.getItem("cart"))||[];
let table = document.getElementById("cartTable");
if(!table) return;

table.innerHTML="";
let total=0;

cart.forEach((item,i)=>{
table.innerHTML += `
<tr>
<td>${item.name}</td>
<td>${item.price}</td>
<td>
<button onclick="changeQty(${i},-1)">-</button>
${item.qty}
<button onclick="changeQty(${i},1)">+</button>
</td>
<td>${item.price*item.qty}</td>
<td><button onclick="removeItem(${i})">X</button></td>
</tr>
`;
total += item.price*item.qty;
});

grandTotal.innerText=total;
}

// QTY
function changeQty(i,val){
let cart=JSON.parse(localStorage.getItem("cart"));
cart[i].qty+=val;
if(cart[i].qty<=0) cart.splice(i,1);
localStorage.setItem("cart", JSON.stringify(cart));
loadCart();
}

// REMOVE
function removeItem(i){
let cart=JSON.parse(localStorage.getItem("cart"));
cart.splice(i,1);
localStorage.setItem("cart", JSON.stringify(cart));
loadCart();
}

// ORDER
function placeOrder(){
if(!localStorage.getItem("loggedInUser")){
orderMsg.innerText="Login required!";
return;
}
orderMsg.innerText="Order Successful!";
localStorage.removeItem("cart");
loadCart();
}

window.onload=loadCart;
