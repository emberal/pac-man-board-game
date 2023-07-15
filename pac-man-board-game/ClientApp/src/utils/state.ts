import Player from "../game/player";
import {atom} from "jotai";
import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {Ghost} from "../game/character";

const playerStorage = createJSONStorage<Player | undefined>(() => sessionStorage);

export const playersAtom = atom<Player[]>([]);
export const playerCharactersAtom = atom(get => get(playersAtom).map(player => player.PacMan));
export const ghostsAtom = atom<Ghost[]>([]);
export const allCharactersAtom = atom(get => [...get(playerCharactersAtom), ...get(ghostsAtom)]);
export const thisPlayerAtom = atomWithStorage<Player | undefined>("player", undefined, {
  ...playerStorage,
  getItem(key, initialValue): Player | undefined {
    const playerProps = playerStorage.getItem(key, initialValue) as PlayerProps | undefined;
    return playerProps ? new Player(playerProps) : undefined;
  },
});
export const diceAtom = atom<number[] | undefined>(undefined);
export const selectedDiceAtom = atom<SelectedDice | undefined>(undefined);
export const currentPlayerAtom = atom<Player | undefined>(undefined);
