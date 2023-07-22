import Player from "../game/player";
import {atom} from "jotai";
import {Ghost} from "../game/character";
import {customMap} from "../game/map";

const playerStorage = "player";
/**
 * All players in the game.
 */
export const playersAtom = atom<Player[]>([]);
/**
 * All player characters (Pac-Man) in the game.
 */
export const playerCharactersAtom = atom(get => get(playersAtom).map(player => player.pacMan));
/**
 * All ghosts in the game.
 */
export const ghostsAtom = atom<Ghost[]>([]);
/**
 * All characters in the game.
 */
export const allCharactersAtom = atom(get => [...get(playerCharactersAtom), ...get(ghostsAtom)]);
/**
 * The player that is currently logged in.
 */
const playerAtom = atom<Player | undefined>(undefined);
/**
 * Gets the player that is currently logged in. If playerAtom is undefined, then it will try to get the player from session storage.
 * @returns An atom representing the player that is currently logged in, or undefined if there is no player logged in.
 */
export const getPlayerAtom = atom(get => {
  const atomValue = get(playerAtom);
  if (!atomValue) {
    const item = sessionStorage.getItem(playerStorage);
    if (item) {
      const playerProps = JSON.parse(item) as PlayerProps;
      return new Player(playerProps);
    }
  }
  return atomValue;
});
/**
 * Sets the player that is currently logged in. If player is undefined, then it will remove the player from session storage.
 * @param player The player that is currently logged in, or undefined if there is no player logged in.
 * @return An atom used to set the player that is currently logged in.
 */
export const setPlayerAtom = atom(null, (get, set, player: Player | undefined) => {
  set(playerAtom, player);
  if (player)
    sessionStorage.setItem(playerStorage, JSON.stringify(player));
  else
    sessionStorage.removeItem(playerStorage);
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
  return get(playersAtom).find(player => player.username === currentPlayerName);
});
/**
 * Whether the roll dice button should be enabled.
 */
export const rollDiceButtonAtom = atom(true);
/**
 * The map that is currently selected.
 */
export const selectedMapAtom = atom(customMap);
