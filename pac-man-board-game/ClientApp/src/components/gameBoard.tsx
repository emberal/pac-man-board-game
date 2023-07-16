import React, {useEffect, useState} from "react";
import {Character} from "../game/character";
import findPossiblePositions from "../game/possibleMovesAlgorithm";
import {GameTile} from "./gameTile";
import {TileType} from "../game/tileType";
import {useAtomValue} from "jotai";
import {allCharactersAtom, currentPlayerAtom, selectedDiceAtom} from "../utils/state";
import Pellet from "../game/pellet";

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

  const currentPlayer = useAtomValue(currentPlayerAtom);
  const characters = useAtomValue(allCharactersAtom);
  const selectedDice = useAtomValue(selectedDiceAtom);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
  const [possiblePositions, setPossiblePositions] = useState<Path[]>([]); // TODO reset when other client moves a character
  const [hoveredPosition, setHoveredPosition] = useState<Path>();

  function handleSelectCharacter(character: Character): void {
    if (character.isPacMan() && currentPlayer?.PacMan.Colour !== character.Colour) {
      return;
    }
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
      stealFromPlayer();
    }
  }

  // TODO steal from other player
  function stealFromPlayer(): void {
    // TODO select player to steal from
    // TODO modal to select player
    // const victim
    // currentPlayer?.stealFrom(victim)
  }

  function pickUpPellets(destination: Path): Position[] {
    const positions: Position[] = [];
    if (selectedCharacter?.isPacMan()) {

      for (const tile of [...destination.Path ?? [], destination.End]) {
        const currentTile = map[tile.Y][tile.X];

        function updateTileAndPlayerBox(isPowerPellet = false): void {
          currentPlayer?.addPellet(new Pellet(isPowerPellet));
          map[tile.Y][tile.X] = TileType.empty;
          positions.push(tile);
        }

        if (currentTile === TileType.pellet) {
          updateTileAndPlayerBox();
        } else if (currentTile === TileType.powerPellet) {
          updateTileAndPlayerBox(true);
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
                  showPath={hoveredPosition?.Path?.find(pos => pos.X === colIndex && pos.Y === rowIndex) !== undefined}
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
