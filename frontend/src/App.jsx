import { useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  useEffect(() => {
    // fetch("http://localhost:3000/auth/login", {
    //   method: "POST",
    //   credentials: "include",
    //   body: JSON.stringify({
    //     username: "test",
    //     password: "1234",
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res));

    axios
      .post(
        "http://localhost:3000/auth/login",
        {
          username: "test",
          password: "1234",
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return <h1>App</h1>;
}

export default App;
