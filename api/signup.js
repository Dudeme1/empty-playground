require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.json({ message: "Signup failed!", error: error.message });
  }

  await supabase.from("users").insert({ email, uses: 0, subscribed: false });

  res.json({ message: "Signup successful! Check your email to verify." });
}