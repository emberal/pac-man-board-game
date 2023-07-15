import Player from "../game/player";
import {atom} from "jotai";
import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {Ghost} from "../game/character";

const playerStorage = createJSONStorage<Player | undefined>(() => sessionStorage);
/**
 * All players in the game.
 */
export const playersAtom = atom<Player[]>([]);
/**
 * All player characters (Pac-Man) in the game.
 */
export const playerCharactersAtom = atom(get => get(playersAtom).map(player => player.PacMan));
/**
 * All ghosts in the game.
 */
export const ghostsAtom = atom<Ghost[]>([]);
/**
 * All characters in the game.
 */
export const allCharactersAtom = atom(get => [...get(playerCharactersAtom), ...get(ghostsAtom)]);
/**
 * The player that is currently using this browser.
 */
export const thisPlayerAtom = atomWithStorage<Player | undefined>("player", undefined, {
  ...playerStorage,
  getItem(key, initialValue): Player | undefined {
    const playerProps = playerStorage.getItem(key, initialValue) as PlayerProps | undefined;
    return playerProps ? new Player(playerProps) : undefined;
  },
});
/**
 * All dice that have been rolled.
 */
export const diceAtom = atom<number[] | undefined>(undefined);
/**
 * The dice that have been selected by the player.
 */
export const selectedDiceAtom = atom<SelectedDice | undefined>(undefined);
/**
 * The name of the player whose turn it is.
 */
export const currentPlayerNameAtom = atom<string | undefined>(undefined);
/**
 * The player whose turn it is.
 */
export const currentPlayerAtom = atom<Player | undefined>(get => {
  const currentPlayerName = get(currentPlayerNameAtom);
  return get(playersAtom).find(player => player.Name === currentPlayerName);
});
