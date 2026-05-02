require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
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
}