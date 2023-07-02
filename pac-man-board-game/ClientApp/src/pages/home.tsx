import React from "react";
import {GameComponent} from "../components/gameComponent";
import Player from "../game/player";

const Home: Component = () => (
  <div>
    <GameComponent player={new Player({
      Name: "Martin",
      Colour: "yellow",
    })}/>
  </div>
);

export default Home;