import React, {useEffect, useState} from "react";
import {Character, PacMan} from "../game/character";

/**
 * 0 = empty
 * 1 = wall
 * 2 = pellet
 * 3 = power pellet
 * 4 = ghost spawn
 * 5 = pacman spawn
 */
const map: number[][] = [
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 5, 1, 0, 1, 4, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 4, 1, 0, 1, 5, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
];

enum TileType {
  empty,
  wall,
  pellet,
  powerPellet,
  ghostSpawn,
  pacmanSpawn,
}

interface BoardProps extends ComponentProps {
  characters: Character[];
}

const Board: Component<BoardProps> = ({className, characters}) => {

  const [tileSize, setTileSize] = useState<number>(2);

  useEffect(() => {
    
    for (const character of characters) { // TODO make more dynamic
      if (character instanceof PacMan) {
        character.position = {x: 3, y: 3};
      } else {
        character.position = {x: 7, y: 3};
      }
    }

    function handleResize(): void {
      const newSize = Math.floor(window.innerWidth / 12);
      setTileSize(newSize);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`w-fit ${className}`}>
      {
        map.map((row, rowIndex) =>
          <div key={rowIndex} className={"flex"}>
            {
              row.map((tile, colIndex) =>
                <Tile key={colIndex + rowIndex * colIndex}
                      type={tile}
                      size={tileSize}
                      character={characters.find(c => c.position.x === colIndex && c.position.y === rowIndex)}/>
              )
            }
          </div>)
      }
    </div>
  );
};

export default Board;

interface TileProps extends ComponentProps {
  size: number,
  type?: TileType,
  character?: Character,
}

const Tile: Component<TileProps> = ({size, type = TileType.empty, character}) => {

  function setColor(): string {
    switch (type) {
      case TileType.empty:
        return "bg-black";
      case TileType.wall:
        return "bg-blue-500";
      case TileType.pellet:
        return "bg-yellow-500";
      case TileType.powerPellet:
        return "bg-orange-500";
      case TileType.ghostSpawn:
        return "bg-red-500";
      case TileType.pacmanSpawn:
        return "bg-green-500";
    }
  }

  return (
    <div className={`${setColor()} relative`} style={{width: `${size}px`, height: `${size}px`}}>
      {character &&
        <div className={"inline-flex justify-center items-center w-full h-full"}>
          <CharacterComponent character={character}/>
        </div>
      }
    </div>
  );
};

interface CharacterComponentProps extends ComponentProps {
  character: Character,
}

const CharacterComponent: Component<CharacterComponentProps> = ({character}) => {
  return (
    <div className={"rounded-full w-4/5 h-4/5 cursor-pointer hover:border border-black"}
         style={{backgroundColor: `${character.color}`}}/>
  );
};
