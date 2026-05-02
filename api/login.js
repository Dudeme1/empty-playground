require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.json({ message: "Login Failed!", error: error.message});
    }
    res.json({ message: "Login successfull!", token: data.session.access_token });
}