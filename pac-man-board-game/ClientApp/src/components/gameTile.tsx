import React, {useEffect, useState} from "react";
import {TileType} from "../game/tileType";
import {Character, Dummy} from "../game/character";
import {Direction} from "../game/direction";
import {getCSSColour} from "../utils/colours";

interface TileWithCharacterProps extends ComponentProps {
  possiblePath?: Path,
  character?: Character,
  type?: TileType,
  handleMoveCharacter?: Action<Path>,
  handleSelectCharacter?: Action<Character>,
  handleStartShowPath?: Action<Path>,
  handleStopShowPath?: VoidFunction,
  isSelected?: boolean,
  showPath?: boolean
}

export const GameTile: Component<TileWithCharacterProps> = (
  {
    possiblePath,
    character,
    type,
    handleMoveCharacter,
    handleSelectCharacter,
    handleStartShowPath,
    handleStopShowPath,
    isSelected = false,
    showPath = false
  }) => (
  <Tile className={`${possiblePath?.end ? "border-4 border-white" : ""}`}
        type={type}
        onClick={possiblePath ? () => handleMoveCharacter?.(possiblePath) : undefined}
        onMouseEnter={possiblePath ? () => handleStartShowPath?.(possiblePath) : undefined}
        onMouseLeave={handleStopShowPath}>
    <>
      {character &&
        <div className={"flex-center w-full h-full"}>
          <CharacterComponent
            character={character}
            onClick={handleSelectCharacter}
            className={isSelected ? "animate-bounce" : ""}/>
        </div>
      }
      {showPath && <Circle/>}
      <AddDummy path={possiblePath}/>
    </>
  </Tile>
);

interface CircleProps extends ComponentProps {
  colour?: Colour,
}

const Circle: Component<CircleProps> = ({colour = "white"}) => (
  <div className={"flex-center w-full h-full"}>
    <div className={`w-1/2 h-1/2 rounded-full ${getCSSColour(colour)}`}/>
  </div>
);

interface TileProps extends ChildProps {
  type?: TileType,
  onClick?: () => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  character?: Character,
  onCharacterClick?: (character: Character) => void,
  characterClass?: string,
}

const Tile: Component<TileProps> = (
  {
    type = TileType.empty,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
    children
  }) => {

  const [tileSize, setTileSize] = useState(2);

  function setColor(): string {
    switch (type) {
      case TileType.wall:
        return "bg-blue-500";
      case TileType.ghostSpawn:
        return "bg-red-500";
      case TileType.pacmanSpawn:
        return "bg-green-500";
      default:
        return "bg-black";
    }
  }

  useEffect(() => {

    function handleResize(): void {
      const newSize = Math.floor(window.innerWidth / 12);
      setTileSize(newSize);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`${setColor()} hover:border relative max-w-[75px] max-h-[75px] ${className}`}
         style={{width: `${tileSize}px`, height: `${tileSize}px`}}
         onClick={onClick}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}>
      {type === TileType.pellet && <Circle colour={"yellow"}/>}
      {type === TileType.powerPellet && <Circle colour={"red"}/>}
      {children}
    </div>
  );
};

interface AddDummyProps extends ComponentProps {
  path?: Path;
}

const AddDummy: Component<AddDummyProps> = ({path}) => (
  <>
    {path &&
      <div className={"flex-center w-full h-full"}>
        <CharacterComponent character={new Dummy({at: path.end, direction: path.direction})}/>
      </div>
    }
  </>
);

interface CharacterComponentProps extends ComponentProps {
  character?: Character,
  onClick?: (character: Character) => void,
}

const CharacterComponent: Component<CharacterComponentProps> = (
  {
    character,
    onClick,
    className
  }) => {

  function getSide() {
    switch (character?.position.direction) {
      case Direction.up:
        return "right-1/4 top-0";
      case Direction.down:
        return "right-1/4 bottom-0";
      case Direction.left:
        return "left-0 top-1/4";
      case Direction.right:
        return "right-0 top-1/4";
    }
  }

  if (character === undefined) return null;

  return (
    <div className={`rounded-full w-4/5 h-4/5 cursor-pointer hover:border border-black relative ${className}`}
         style={{backgroundColor: `${character.color}`}}
         onClick={() => onClick?.(character)}>
      <div>
        <div className={`absolute ${getSide()} w-1/2 h-1/2 rounded-full bg-black`}/>
      </div>
    </div>
  );
};
