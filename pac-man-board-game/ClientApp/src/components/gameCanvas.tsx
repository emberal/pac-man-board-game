import React from "react";
import TileMap from "../game/tileMap";

const tileMap = new TileMap();

const GameCanvas: Component = ({className}) => {

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;

    tileMap.draw(context);
  }, []);

  return (
    <canvas ref={canvasRef} className={`shadow-lg w-3/4 aspect-square ${className}`}></canvas>
  );
};

export default GameCanvas;
