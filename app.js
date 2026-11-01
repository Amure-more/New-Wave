const products = [
  {id:1,name:"Portable Electric Lunch Box",category:"Home",price:18500,emoji:"🍱",badge:"POPULAR",desc:"Enjoy warm meals at work or on the go."},
  {id:2,name:"Gua Sha Self-Care Set",category:"Beauty",price:9500,emoji:"🧖",badge:"SELF-CARE",desc:"A simple addition to your daily care routine."},
  {id:3,name:"Baby Bath Support Set",category:"Baby",price:22000,emoji:"🛁",badge:"FAMILY PICK",desc:"Make little ones' bath time more comfortable."},
  {id:4,name:"Mini Desk Vacuum",category:"Tech",price:12500,emoji:"🧹",badge:"SMART FIND",desc:"A compact helper for tidy desks and workspaces."},
  {id:5,name:"Wall-Mounted Soap Holder",category:"Home",price:6500,emoji:"🧼",badge:"EVERYDAY",desc:"Keep your sink or shower area organised."},
  {id:6,name:"Soft Baby Head Support Pillow",category:"Baby",price:11500,emoji:"☁️",badge:"BABY CARE",desc:"A soft nursery accessory. Check suitability before use."},
  {id:7,name:"LED Reading Light",category:"Tech",price:8000,emoji:"💡",badge:"NEW PICK",desc:"Convenient lighting for reading and focused work."},
  {id:8,name:"Daily Skincare Tool",category:"Beauty",price:7800,emoji:"✨",badge:"FAVOURITE",desc:"A handy tool for your at-home skincare routine."}
];
const money = value => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(value);
let activeCategory = "All";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("newpicks-cart") || "[]");

function renderProducts(){
  const shown = products.filter(p => (activeCategory==="All" || p.category===activeCategory) &&
    (p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)));
  document.getElementById("product-grid").innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image"><small>${p.badge}</small>${p.emoji}</div>
      <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span>
      <button class="add-button" data-add="${p.id}">＋ Add to cart</button></div></div>
    </article>`).join("");
  document.getElementById("result-count").textContent = `${shown.length} products`;
  document.getElementById("empty-state").hidden = shown.length !== 0;
}
function saveCart(){localStorage.setItem("newpicks-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});saveCart();}
function renderCart(){
  const count=cart.reduce((n,x)=>n+x.qty,0);
  document.getElementById("cart-count").textContent=count;
  const items=cart.map(x=>({...products.find(p=>p.id===x.id),qty:x.qty}));
  document.getElementById("cart-items").innerHTML=items.length?items.map(p=>`
    <div class="cart-row"><div class="cart-emoji">${p.emoji}</div><div><strong>${p.name}</strong><small>${money(p.price)}</small>
    <div class="quantity"><button data-qty="${p.id}" data-change="-1">−</button><span>${p.qty}</span><button data-qty="${p.id}" data-change="1">+</button></div></div>
    <span class="cart-price">${money(p.price*p.qty)}</span></div>`).join(""):`<div class="cart-empty">Your cart is empty.<br><br>Find something you love and add it here.</div>`;
  document.getElementById("cart-subtotal").textContent=money(items.reduce((n,p)=>n+p.price*p.qty,0));
}
function openCart(){document.getElementById("cart-drawer").classList.add("open");document.getElementById("overlay").classList.add("show");document.getElementById("cart-drawer").setAttribute("aria-hidden","false");}
function closeCart(){document.getElementById("cart-drawer").classList.remove("open");document.getElementById("overlay").classList.remove("show");document.getElementById("cart-drawer").setAttribute("aria-hidden","true");}
document.getElementById("product-grid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b){addToCart(Number(b.dataset.add));b.textContent="Added ✓";setTimeout(()=>b.textContent="＋ Add to cart",900);}});
document.getElementById("cart-items").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(!b)return;const id=Number(b.dataset.qty),change=Number(b.dataset.change),item=cart.find(x=>x.id===id);if(item){item.qty+=change;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}});
document.getElementById("category-grid").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".category-tile").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
document.getElementById("search-form").addEventListener("submit",e=>{e.preventDefault();searchTerm=document.getElementById("search-input").value.trim().toLowerCase();renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});});
document.getElementById("search-input").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("checkout-button").addEventListener("click",()=>alert("This is the NewPicks storefront preview. Online checkout is not connected yet. We will connect a secure payment provider and order system in the next build stage."));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
