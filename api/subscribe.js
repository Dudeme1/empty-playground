require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const DodoPayments = require("dodopayments").default;
const cors = require('cors');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: "test_mode"
})

module.exports = async (req, res) => {
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
    return_url: "https://empty-playground.vercel.app/dashboard",
    payment_link: true,
  });

  res.json({ url: session.checkout_url });
}