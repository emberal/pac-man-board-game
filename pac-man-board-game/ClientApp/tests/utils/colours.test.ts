import {expect, test} from "vitest"
import {getBgCSSColour} from "../../src/utils/colours";
import {Colour} from "../../src/game/colour";

test('white should not use -500', () => {
  const cssColour = getBgCSSColour(Colour.White);
  expect(cssColour).toBe("bg-white");
});

test('purple should use -500', () => {
  const cssColour = getBgCSSColour(Colour.Purple);
  expect(cssColour).toBe("bg-purple-500");
});

test("yellow should use -500", () => {
  const cssColour = getBgCSSColour(Colour.Yellow);
  expect(cssColour).toBe("bg-yellow-500");
});
