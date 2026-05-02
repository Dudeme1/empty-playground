require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { Webhooks } = require("@dodopayments/express");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const webhookHandler = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET,
  onSubscriptionActive: async (payload) => {
    const email = payload.data.customer.email;
    await supabase.from("users").update({ subscribed: true }).eq("email", email);
    console.log("Subscribed:", email);
  }
});

module.exports = (req, res) => {
  return webhookHandler(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};