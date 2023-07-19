import React, {FC, useRef} from "react";
import Player from "../game/player";
import Input from "../components/input";
import Dropdown from "../components/dropdown";
import {Colour, getColours} from "../game/colour";
import {useNavigate} from "react-router-dom";
import {useSetAtom} from "jotai";
import {thisPlayerAtom} from "../utils/state";

const Home: FC = () => {

  const input = useRef<HTMLInputElement>(null);
  const dropdown = useRef<HTMLSelectElement>(null);
  const setPlayer = useSetAtom(thisPlayerAtom);
  const navigate = useNavigate();

  function formHandler(): void {
    if (!input.current || !dropdown.current) return;
    const player = new Player({
      UserName: input.current.value,
      Colour: dropdown.current.value as Colour,
    });
    setPlayer(player);
    navigate("/game");
  }

  return (
    <>
      <h1 className={"w-fit mx-auto"}>Pac-Man The Board Game</h1>
      <form className={"flex flex-col items-center"} onSubmit={formHandler}>
        <p>Enter your name:</p>
        <Input ref={input} required/>
        <p>Choose a colour:</p>
        <Dropdown ref={dropdown} options={getColours()}/>
        <br/>
        <button type={"submit"}>Find game</button>
      </form>
    </>
  );
};

export default Home;