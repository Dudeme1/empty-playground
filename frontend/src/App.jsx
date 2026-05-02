import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HiScreen from "../components/HiScreen";
import LoginScreen from "../components/LoginScreen";
import SignupScreen from "../components/SignupScreen";

function App() {
  const [ token, setToken ] = useState(null);
  const [ email, setEmail ] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen setToken={setToken} setAppEmail={setEmail} />} />
        <Route path="/login" element={<LoginScreen setToken={setToken} setAppEmail={setEmail} />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/dashboard" element={<HiScreen token={token} email={email} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App