import { useState } from "react"

function HiScreen({ token, email }) {
  const [ name, setName ] = useState("");
  const [ message, setMessage ] = useState("");
  const sayHi = async () => {
    try {
      const response = await fetch("http://localhost:3000/sayHi", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({ name: name, token: token })
    });
    if (!response.ok) {
      throw new Error(response.status);
    } else {
      const data = await response.json();
      setMessage(data.message);
    }
    } catch (err) {
      console.log(err);
    }
  }
  const handleSubscribe = async () => {
    try {
      const response = await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ token: token, email: email })
      });
      if (!response.ok) {
        throw new Error(response.status);
      } else {
        const data = await response.json();
        console.log(data);
        console.log(data.url);
        window.location.href = data.url;
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <div>
          <h1>Welcome! you are logged in!</h1>
      </div>
      <div>
        <input
        value={name}
        onChange={ (e) => setName(e.target.value)}
        />
        <button onClick={sayHi}>Hi</button>
      </div>
      <div>
        { message ? <h3>{message}</h3> : <></>}
      </div>
      <div>
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
    </div>
  )
}

export default HiScreen