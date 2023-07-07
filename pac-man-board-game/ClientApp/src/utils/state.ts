// TODO merge character and player atoms, since the player is the owner of the character
import Player from "../game/player";
import {atom} from "jotai";
import {Character} from "../game/character";

export const charactersAtom = atom<Character[] | undefined>(undefined);
export const playersAtom = atom<Player[]>([]);
export const thisPlayerAtom = atom<Player | undefined>(undefined);
export const diceAtom = atom<number[] | undefined>(undefined);
export const selectedDiceAtom = atom<SelectedDice | undefined>(undefined);
export const currentPlayerAtom = atom<Player | undefined>(undefined);
