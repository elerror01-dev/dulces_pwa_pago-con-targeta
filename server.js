require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/create-payment-intent", async (req, res) => {
  const carrito = req.body.carrito;

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "mxn",
    automatic_payment_methods: { enabled: true }
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(4242, () => {
  console.log("Servidor en http://localhost:4242");
});