import React, {FC, FormEvent, useState} from "react";
import {Button} from "../components/button";
import Input from "../components/input";
import {useSetAtom} from "jotai";
import {thisPlayerAtom} from "../utils/state";
import Player from "../game/player";
import {useNavigate} from "react-router-dom";
import {postData} from "../utils/api";

const LoginPage: FC = () => {

  const setThisPlayer = useSetAtom(thisPlayerAtom);
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();

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
      const data = await response.json() as PlayerProps;
      setThisPlayer(new Player(data));
      navigate("/lobby");
    } else {
      const data = await response.text();
      console.error(data);
      setError(data);
    }

  }

  const username = "username", password = "password";

  return (
    <form onSubmit={handleLogin} className={"container w-fit mx-auto flex flex-col gap-2"}>
      <h1 className={"my-5"}>Login</h1>
      {error && <p className={"text-red-500"}>{error}</p>}
      <label htmlFor={username}>Username:</label>
      <Input id={username} name={username} placeholder={"Username"} autoComplete={"username"} required/>
      <label htmlFor={password}>Password:</label>
      <Input id={password} name={password} type={"password"} placeholder={"Password"}
             autoComplete={"current-password"} required/>
      <Button type={"submit"}>Login</Button>
    </form>
  );
}

export default LoginPage;
