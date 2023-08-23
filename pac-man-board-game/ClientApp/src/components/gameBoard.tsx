import React, {FC, Fragment, useEffect, useState} from "react";
import {Character} from "../game/character";
import findPossiblePositions from "../game/possibleMovesAlgorithm";
import {GameTile} from "./gameTile";
import {TileType} from "../game/tileType";
import {atom, useAtom, useAtomValue, useSetAtom} from "jotai";
import {allCharactersAtom, currentPlayerAtom, playersAtom, selectedDiceAtom} from "../utils/state";
import {Dialog, Transition} from "@headlessui/react";

interface BoardProps extends ComponentProps {
  onMove?: Action<Position[]>,
  map: GameMap
}

const modalOpenAtom = atom(false);

const Board: FC<BoardProps> = (
  {
    className,
    onMove,
    map
  }) => {

  const currentPlayer = useAtomValue(currentPlayerAtom);
  const characters = useAtomValue(allCharactersAtom);
  const selectedDice = useAtomValue(selectedDiceAtom);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
  const [possiblePositions, setPossiblePositions] = useState<Path[]>([]);
  const [hoveredPosition, setHoveredPosition] = useState<Path>();
  const setModalOpen = useSetAtom(modalOpenAtom);

  function handleSelectCharacter(character: Character): void {
    if (character.isPacMan() && currentPlayer?.pacMan.colour !== character.colour) {
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
    const takenChar = characters.find(c => c.isPacMan() && c.isAt(destination.end));
    if (takenChar) {
      takenChar.moveToSpawn();
      stealFromPlayer();
    }
  }

  function stealFromPlayer(): void {
    setModalOpen(true);
  }

  function pickUpPellets(destination: Path): Position[] {
    const positions: Position[] = [];
    if (selectedCharacter?.isPacMan()) {

      for (const tile of [...destination.path ?? [], destination.end]) {
        const currentTile = map[tile.y][tile.x];

        function updateTileAndPlayerBox(isPowerPellet = false): void {
          if (isPowerPellet) {
            currentPlayer?.addPowerPellet();
          } else {
            currentPlayer?.addPellet();
          }
          map[tile.y][tile.x] = TileType.empty;
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
      <SelectPlayerModal/>
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

const SelectPlayerModal: FC = () => {
  const [isOpen, setIsOpen] = useAtom(modalOpenAtom);
  const currentPlayer = useAtomValue(currentPlayerAtom);
  const allPlayers = useAtomValue(playersAtom).filter(p => p !== currentPlayer);

  if (currentPlayer === undefined) return null;

  function close(): void {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25"/>
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Steal from player
                  </Dialog.Title>
                  <div className="mt-2">
                    <Dialog.Description className="text-sm text-gray-500">
                      Select a player to steal up to 2 pellets from.
                    </Dialog.Description>
                  </div>

                  {
                    allPlayers.map(player =>
                      <div key={player.username} className={"border-b pb-1"}>
                        <span className={"mx-2"}>{player.username} has {player.box.pellets} pellets</span>
                        <button className={"text-blue-500 enabled:cursor-pointer disabled:text-gray-500"}
                                style={{background: "none"}}
                                disabled={player.box.pellets === 0}
                                onClick={() => {
                                  currentPlayer?.stealFrom(player);
                                  close();
                                }}>
                          Steal
                        </button>
                      </div>
                    )
                  }

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={close}
                    >
                      Don't steal from anyone
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
