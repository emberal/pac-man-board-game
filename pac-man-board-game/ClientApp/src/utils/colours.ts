export function getCSSColour(colour: Colour): string {
  return `bg-${colour}${colour === "white" ? "-500" : ""}`;
} 
