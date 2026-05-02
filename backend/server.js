require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const DodoPayments = require("dodopayments").default;
const { Webhooks } = require("@dodopayments/express");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: "test_mode"
})

app.get("/", (req, res) => {
  res.json({ message: "Server is alive! 🚀" });
});

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    res.json({ message: "DB connected but no tables yet!", error: error.message });
  } else {
    res.json({ message: "DB connected and working!", data });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.json({ message: "Signup failed!", error: error.message });
  }

  await supabase.from("users").insert({ email, uses: 0, subscribed: false });

  res.json({ message: "Signup successful! Check your email to verify." });
});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.json({ message: "Login Failed!", error: error.message});
    }
    res.json({ message: "Login successfull!", token: data.session.access_token });
});

app.post("/sayHi", async(req, res) => {
    const { name, token } = req.body;

    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
        return res.json({ message: `Not logged in! ${authError.message}` });
    }
    console.log("userData:", JSON.stringify(userData));

    const email = userData.user.email;
    console.log("email from token:", email);
    const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
    (console.log(user));
    if (user.subscribed || user.uses < 5) {
        await supabase.from("users").update({ uses: user.uses + 1 }).eq("email", email);
        return res.json({ message: `Hi ${name}! 👋`});
    }

    res.json({ message: "You've used up your 5 free uses! Subscribe to continue" });
});

app.post("/subscribe", async (req, res) => {
  const { token } = req.body;

  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error) return res.json({ message: "Not logged in!" });

  const email = userData.user.email;

  const session = await dodo.checkoutSessions.create({
    product_cart: [{ 
      product_id: process.env.DODO_PRODUCT_ID, 
      quantity: 1 
    }],
    customer: { email },
    return_url: "http://localhost:5173/dashboard",
    payment_link: true,
  });

  res.json({ url: session.checkout_url });
});

app.post("/webhook", Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET,
  onSubscriptionActive: async (payload) => {
    console.log("PAYLOAD:", JSON.stringify(payload));
    const email = payload.data.customer.email;
    await supabase.from("users").update({ subscribed: true }).eq("email", email);
    console.log("Subscribed:", email);
  }
}));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});