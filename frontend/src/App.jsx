import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {

  const [Profile, setProfile] = useState(null)

  function loginHandle() {
    axios
      .post(
        "http://localhost:3000/auth/login",
        {
          username: "admin",
          password: "1234",
        },
        { withCredentials: true }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function googleHandle() {
    /* axios
      .get("http:localhost:3000/auth/google", { withCredentials: true })
      .then((res) => console.log(res))
      .catch((err) => console.log(err)); */
      window.location.href = 'http://localhost:3000/auth/google'
  }

  function logoutHandle() {
    axios
      .delete("http://localhost:3000/logout", { withCredentials: true })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function getBudgets() {
    axios
      .get("http://localhost:3000/budget",{withCredentials: true})
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function getProfile() {
    
  }

  return (
    <div>
      <h1>App</h1>
      <button type="button" onClick={loginHandle}>
        Login
      </button>
      <button type="button" onClick={googleHandle}>
        Google
      </button>
      <button type="button" onClick={logoutHandle}>
        logout
      </button>
      <button type="button" onClick={getBudgets}>
        Budgets
      </button>

      <br />

      {}
    </div>
  );
}

export default App;
