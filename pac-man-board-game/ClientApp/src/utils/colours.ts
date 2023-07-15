import {Colour} from "../game/colour";

/**
 * Converts the given enum Colour to a Tailwind CSS class name.
 * @param colour The colour to convert
 * @returns The Tailwind CSS class name
 */
export function getBgCSSColour(colour: Colour): string {
  return `bg-${colour}${colour !== Colour.White ? "-500" : ""}`;
} 
