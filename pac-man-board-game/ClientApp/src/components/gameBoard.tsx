import React, {useEffect, useState} from "react";
import {Character, PacMan} from "../game/character";
import findPossiblePositions from "../game/possibleMovesAlgorithm";
import {GameTile} from "./gameTile";
import {TileType} from "../game/tileType";
import {useAtomValue} from "jotai";
import {allCharactersAtom, selectedDiceAtom} from "../utils/state";

interface BoardProps extends ComponentProps {
  onMove?: Action<Position[]>,
  map: GameMap
}

const Board: Component<BoardProps> = (
  {
    className,
    onMove,
    map
  }) => {

  const characters = useAtomValue(allCharactersAtom);
  const selectedDice = useAtomValue(selectedDiceAtom);
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

      if (selectedCharacter.isGhost()) {
        tryMovePacManToSpawn(destination);
      }

      selectedCharacter.follow(destination);

      const positions = pickUpPellets(destination);
      onMove?.(positions);
      setSelectedCharacter(undefined);
    }
  }

  function tryMovePacManToSpawn(destination: Path): void {
    const takenChar = characters.find(c => c.isPacMan() && c.isAt(destination.End));
    if (takenChar) {
      takenChar.moveToSpawn();
      // TODO steal from player
    }
  }

  function pickUpPellets(destination: Path): Position[] {
    const positions: Position[] = [];
    if (selectedCharacter instanceof PacMan) {
      const pacMan = selectedCharacter as PacMan;

      for (const tile of [...destination.Path ?? [], destination.End]) {
        const currentTile = map[tile.Y][tile.X];

        if (currentTile === TileType.pellet) {
          // pacMan.box.addPellet(new Pellet()); // TODO update to current player
          map[tile.Y][tile.X] = TileType.empty;
          positions.push(tile);
        } else if (currentTile === TileType.powerPellet) {
          // pacMan.box.addPellet(new Pellet(true));
          map[tile.Y][tile.X] = TileType.empty;
          positions.push(tile);
        }
      }
    }
    return positions;
  }

  useEffect(() => {
    if (selectedCharacter && selectedDice) {
      const possiblePaths = findPossiblePositions(map, selectedCharacter, selectedDice.value, characters);
      setPossiblePositions(possiblePaths);
    } else {
      setPossiblePositions([]);
    }
  }, [selectedCharacter, selectedDice]);

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
                  possiblePath={possiblePositions.find(p => p.End.X === colIndex && p.End.Y === rowIndex)}
                  character={characters.find(c => c.isAt({X: colIndex, Y: rowIndex}))}
                  isSelected={selectedCharacter?.isAt({X: colIndex, Y: rowIndex})}
                  showPath={hoveredPosition?.Path?.find(pos => pos.x === colIndex && pos.y === rowIndex) !== undefined}
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
