import React, {useEffect, useState} from "react";
import {Character, PacMan} from "../game/character";
import findPossiblePositions from "../game/possibleMovesAlgorithm";
import {Direction} from "../game/direction";
import {GameTile} from "./gameTile";
import {TileType} from "../game/tileType";
import {NormalPellet, PowerPellet} from "../game/pellet";

interface BoardProps extends ComponentProps {
  characters: Character[],
  selectedDice?: SelectedDice,
  onMove?: Action<Character>,
  map: GameMap
}

const Board: Component<BoardProps> = (
  {
    className,
    characters,
    selectedDice,
    onMove,
    map
  }) => {

  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
  const [possiblePositions, setPossiblePositions] = useState<Path[]>([]); // TODO reset when other client moves a character
  const [hoveredPosition, setHoveredPosition] = useState<Path>();

  function handleSelectCharacter(character: Character): void {
    setSelectedCharacter(character);
  }

  function handleShowPath(path: Path): void {
    setHoveredPosition(path);
  }

  function handleMoveCharacter(destination: Path): void {
    if (selectedCharacter) {
      setHoveredPosition(undefined);
      selectedCharacter.follow(destination);
      
      pickUpPellets(destination);
      onMove?.(selectedCharacter);
      setSelectedCharacter(undefined);
    }
  }

  function pickUpPellets(destination: Path): void {
    if (selectedCharacter instanceof PacMan) {
      const pacMan = selectedCharacter as PacMan;

      for (const tile of [...destination.path ?? [], destination.end]) {
        const currentTile = map[tile.y][tile.x];
        if (currentTile === TileType.pellet) {
          pacMan.box.addPellet(new NormalPellet());
          map[tile.y][tile.x] = TileType.empty;
        } else if (currentTile === TileType.powerPellet) {
          pacMan.box.addPellet(new PowerPellet());
          map[tile.y][tile.x] = TileType.empty;
        }
      }
    }
  }

  useEffect(() => {
    if (selectedCharacter && selectedDice) {
      const possiblePaths = findPossiblePositions(map, selectedCharacter, selectedDice.value);
      setPossiblePositions(possiblePaths);
    } else {
      setPossiblePositions([]);
    }
  }, [selectedCharacter, selectedDice]);

  useEffect(() => {

    for (const character of characters) { // TODO make more dynamic
      if (character instanceof PacMan) {
        character.position = {end: {x: 3, y: 3}, direction: Direction.up};
      } else {
        character.position = {end: {x: 7, y: 3}, direction: Direction.up};
      }
    }
  }, []);

  return (
    <div className={`w-fit ${className}`}>
      {
        map.map((row, rowIndex) =>
          <div key={rowIndex} className={"flex"}>
            {
              row.map((tile, colIndex) =>
                <GameTile
                  key={colIndex + rowIndex * colIndex}
                  type={tile}
                  possiblePath={possiblePositions.find(p => p.end.x === colIndex && p.end.y === rowIndex)}
                  character={characters.find(c => c.isAt({x: colIndex, y: rowIndex}))}
                  isSelected={selectedCharacter?.isAt({x: colIndex, y: rowIndex})}
                  showPath={hoveredPosition?.path?.find(pos => pos.x === colIndex && pos.y === rowIndex) !== undefined}
                  handleMoveCharacter={handleMoveCharacter}
                  handleSelectCharacter={handleSelectCharacter}
                  handleStartShowPath={handleShowPath}
                  handleStopShowPath={() => setHoveredPosition(undefined)}/>
              )
            }
          </div>)
      }
    </div>
  );
};

export default Board;
