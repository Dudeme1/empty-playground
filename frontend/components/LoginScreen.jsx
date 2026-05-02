import { useState } from "react"
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "";

function LoginScreen({ setToken, setAppEmail }) {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ email: email, password: password})
      });

      if (!response.ok) {
        throw new Error(response.status);
      } else {
        const data = await response.json();
        setToken(data.token);
        setAppEmail(email);
        navigate("/dashboard");
      }
    } catch (err) {
      return window.alert(err.message)
    }

    }
  return (
      <div>
        <div>
          <input
          value={email} 
          onChange={ (e) => setEmail(e.target.value)}
          />
          <input
          type="password"
          value={password} 
          onChange={ (e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
        <div>
          <button onClick={ () => navigate("/signup")} >Sign Up </button>
        </div>
      </div>
  )
}

export default LoginScreen