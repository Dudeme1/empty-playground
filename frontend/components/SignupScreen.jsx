import { useState } from "react"
import { useNavigate } from "react-router-dom";

function SignupScreen() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ email: email, password: password})
      });

      if (!response.ok) {
        throw new Error(response.status);
      } else {
        const data = await response.json();
        window.alert(data.message);
        navigate("/login");
      }
    } catch (err) {
      return window.alert(err.message);
    }

    }
  return (
      <div>
        <input
        value={email} 
        onChange={ (e) => setEmail(e.target.value)}
        />
        <input
        value={password} 
        onChange={ (e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Sign up</button>
      </div>
  )
}

export default SignupScreen