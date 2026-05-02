require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  const event = req.body;
  
  console.log("Webhook received:", event.type);

  if (event.type === "subscription.active") {
    const email = event.data.customer.email;
    await supabase.from("users").update({ subscribed: true }).eq("email", email);
    console.log("Subscribed:", email);
  }

  res.status(200).json({ received: true });
};