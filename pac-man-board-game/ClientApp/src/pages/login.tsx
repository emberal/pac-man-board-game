import React, {FormEvent} from "react";
import {Button} from "../components/button";
import Input from "../components/input";
import {useSetAtom} from "jotai";
import {thisPlayerAtom} from "../utils/state";
import Player from "../game/player";
import {useNavigate} from "react-router-dom";
import {postData} from "../utils/api";

const Login = () => {

  const setThisPlayer = useSetAtom(thisPlayerAtom);
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const fields = e.currentTarget.querySelectorAll("input");

    let user: User = {username: "", password: ""};
    for (const field of fields) {
      user = {
        ...user,
        [field.name]: field.value,
      }
    }

    const response = await postData("/player/login", {
      body: {username: user.username, password: user.password} as User
    })


    if (response.ok) {
      const data = await response.json();
      console.debug("Login successful: ", data);
      setThisPlayer(new Player(data as PlayerProps));
      navigate("/lobby");
    } else {
      const data = await response.text();
      console.error("Error: ", data);
      // TODO display error
    }

  }

  return ( // TODO prettify
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <Input name={"username"} placeholder={"Username"}/>
      <Input name={"password"} type={"password"} placeholder={"Password"}/>
      <Button type={"submit"}>Login</Button>
    </form>
  );
}

export default Login;
