import React from "react";
import {TileType} from "../game/tileType";
import {Character, Dummy} from "../game/character";
import {Direction} from "../game/direction";

interface TileWithCharacterProps extends ComponentProps {
  possiblePath?: Path,
  character?: Character,
  size: number,
  type?: TileType,
  handleMoveCharacter?: (path: Path) => void,
  handleSelectCharacter?: (character: Character) => void,
  handleStartShowPath?: (path: Path) => void,
  handleStopShowPath?: () => void,
  isSelected?: boolean,
  showPath?: boolean
}

export const GameTile: Component<TileWithCharacterProps> = (
  {
    possiblePath,
    character,
    size,
    type,
    handleMoveCharacter,
    handleSelectCharacter,
    handleStartShowPath,
    handleStopShowPath,
    isSelected = false,
    showPath = false
  }) => {
  return (
    <Tile className={`${possiblePath?.end ? "border-4 border-white" : ""}`}
          type={type}
          size={size}
          onClick={possiblePath ? () => handleMoveCharacter?.(possiblePath) : undefined}
          onMouseEnter={possiblePath ? () => handleStartShowPath?.(possiblePath) : undefined}
          onMouseLeave={handleStopShowPath}>
      <>
        {character &&
          <div className={"flex-center w-full h-full"}>
            <CharacterComponent
              character={character}
              onClick={handleSelectCharacter}
              className={`${isSelected ? "animate-bounce" : ""}`}/>
          </div>
        }
        {showPath &&
          <PathSymbol/>
        }
        <AddDummy path={possiblePath}/>
      </>
    </Tile>
  );
};

const PathSymbol: Component = () => ( // TODO sometimes shows up when it shouldn't
  <div className={"flex-center w-full h-full"}>
    <div className={"w-1/2 h-1/2 rounded-full bg-white"}/>
  </div>
);

interface TileProps extends ChildProps {
  size: number,
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
    size,
    type = TileType.empty,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
    children
  }) => {

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
    <div className={`${setColor()} hover:border relative max-w-[75px] max-h-[75px] ${className}`}
         style={{width: `${size}px`, height: `${size}px`}}
         onClick={onClick}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}>
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
        <CharacterComponent character={new Dummy(path)}/>
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
