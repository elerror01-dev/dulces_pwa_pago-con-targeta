let carrito = [];
let stripe;
let elements;

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  render();
}

function render() {
  const lista = document.getElementById("carrito");
  lista.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    total += item.precio;

    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = total;
}

// Abrir pago
async function abrirPago() {
  if (carrito.length === 0) {
    alert("Carrito vacío");
    return;
  }

  document.getElementById("pago").classList.remove("hidden");

  const res = await fetch("/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carrito })
  });

  const data = await res.json();

  
const stripe = Stripe("pk_live_51T4M20FgtNqAHTMVi02lvSbsw64sZJwD0o6ZUfzfDCTLcDjQjsocrxNgbWD1nZq73tCt3WpRupGRQMr7aZAuCzfr00JUZ6QpgK");
  elements = stripe.elements({
    clientSecret: data.clientSecret
  });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  document
    .querySelector("#payment-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href
        }
      });

      if (error) {
        alert(error.message);
      }
    });
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('SW registrado'))
    .catch(err => console.error('Error SW:', err));
}