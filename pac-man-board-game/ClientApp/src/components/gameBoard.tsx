import React, {useEffect, useState} from "react";
import {Character, PacMan} from "../game/character";
import findPossiblePositions from "../game/possibleMovesAlgorithm";
import {Direction} from "../game/direction";
import {GameTile} from "./gameTile";

interface BoardProps extends ComponentProps {
  characters: Character[],
  selectedDice?: SelectedDice,
  onMove?: (character: Character) => void,
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

  function handleMoveCharacter(path: Path): void {
    if (selectedCharacter) {
      setHoveredPosition(undefined);
      selectedCharacter.follow(path);
      onMove?.(selectedCharacter);
      setSelectedCharacter(undefined);
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
