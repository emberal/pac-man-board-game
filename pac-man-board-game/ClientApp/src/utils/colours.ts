export function getCSSColour(colour: Colour): string {
  let tailwindColour: string;
  switch (colour) {
    case "red":
      tailwindColour = "bg-red-500";
      break;
    case "blue":
      tailwindColour = "bg-blue-500";
      break;
    case "yellow":
      tailwindColour = "bg-yellow-500";
      break;
    case "green":
      tailwindColour = "bg-green-500";
      break;
    case "purple":
      tailwindColour = "bg-purple-500";
      break;
    case "grey":
      tailwindColour = "bg-gray-500";
      break;
    default:
      tailwindColour = "bg-white";
      break;
  }
  return tailwindColour;
} 
