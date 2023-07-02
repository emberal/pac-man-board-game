import React, {FormEvent, useRef, useState} from "react";
import {GameComponent} from "../components/gameComponent";
import Player from "../game/player";
import Input from "../components/input";
import Dropdown from "../components/dropdown";
import {Colour, getColours} from "../game/colour";

const Home: Component = () => {

  const [player, setPlayer] = useState<Player>();
  const input = useRef<HTMLInputElement>(null);
  const dropdown = useRef<HTMLSelectElement>(null);

  function formHandler(e: FormEvent): void {
    e.preventDefault();
    if (!input.current || !dropdown.current) return;
    setPlayer(new Player({
      Name: input.current.value,
      Colour: dropdown.current.value as Colour,
    }));
  }

  return (
    <>
      <h1 className={"w-fit mx-auto"}>Pac-Man The Board Game</h1>
      {
        player ?
          /*TODO move to own page*/
          <GameComponent player={player}/>
          :
          <form className={"flex flex-col items-center"} onSubmit={formHandler}>
            <p>Enter your name:</p>
            <Input ref={input} required/>
            <p>Choose a colour:</p>
            <Dropdown ref={dropdown} options={getColours()}/>
            <br/>
            <button type={"submit"}>Find game</button>
          </form>
      }
    </>
  );
};

export default Home;