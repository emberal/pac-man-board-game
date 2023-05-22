import React, {useEffect, useState} from "react";
import {Character, PacMan} from "../game/character";
import findPossiblePositions from "../game/possibleMovesAlgorithm";
import {TileType} from "../game/tileType";

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

interface BoardProps extends ComponentProps {
  characters: Character[],
  selectedDice?: SelectedDice,
  onMove?: (character: Character) => void
}

const Board: Component<BoardProps> = (
  {
    className,
    characters,
    selectedDice,
    onMove
  }) => {

  const [tileSize, setTileSize] = useState(2);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
  // TODO show the paths to the positions when hovering over a possible position (type Path = CharacterPosition[])
  const [possiblePositions, setPossiblePositions] = useState<Position[]>([]); // TODO reset when other client moves a character

  function handleSelectCharacter(character: Character): void {
    setSelectedCharacter(character);
  }

  function handleMoveCharacter(position: Position): void {
    if (selectedCharacter) {
      selectedCharacter.moveTo(position);
      onMove?.(selectedCharacter);
      setSelectedCharacter(undefined);
    }
  }

  useEffect(() => {
    if (selectedCharacter && selectedDice) {
      const possiblePositions = findPossiblePositions(map, selectedCharacter, selectedDice.value);
      setPossiblePositions(possiblePositions);
    } else {
      setPossiblePositions([]);
    }
  }, [selectedCharacter, selectedDice]);

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
                <Tile className={`${possiblePositions.find(p => p.x === colIndex && p.y === rowIndex) ?
                  "border-4 border-white" : ""}`}
                      characterClass={`${selectedCharacter?.isAt({x: colIndex, y: rowIndex}) ? "animate-bounce" : ""}`}
                      key={colIndex + rowIndex * colIndex}
                      type={tile}
                      size={tileSize}
                      character={characters.find(c => c.isAt({x: colIndex, y: rowIndex}))}
                      onCharacterClick={handleSelectCharacter}
                      onClick={possiblePositions.find(p => p.x === colIndex && p.y === rowIndex) ?
                        () => handleMoveCharacter({x: colIndex, y: rowIndex}) : undefined}
                />
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
  onClick?: () => void,
  character?: Character,
  onCharacterClick?: (character: Character) => void,
  characterClass?: string,
}

const Tile: Component<TileProps> = (
  {
    size,
    type = TileType.empty,
    onClick,
    character,
    onCharacterClick,
    characterClass,
    className,
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
         onClick={onClick}>
      {character &&
        <div className={"inline-flex justify-center items-center w-full h-full"}>
          <CharacterComponent character={character} onClick={onCharacterClick} className={characterClass}/>
        </div>
      }

    </div>
  );
};

interface CharacterComponentProps extends ComponentProps {
  character: Character,
  onClick?: (character: Character) => void,
}

const CharacterComponent: Component<CharacterComponentProps> = (
  {
    character,
    onClick,
    className
  }) => (
  <div className={`rounded-full w-4/5 h-4/5 cursor-pointer hover:border border-black ${className}`}
       style={{backgroundColor: `${character.color}`}}
       onClick={() => onClick?.(character)}/>
);
