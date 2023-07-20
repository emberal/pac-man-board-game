import {beforeEach, expect, test} from "vitest";
import possibleMovesAlgorithm from "../../src/game/possibleMovesAlgorithm";
import {Ghost, PacMan} from "../../src/game/character";
import {Direction} from "../../src/game/direction";
import {Colour} from "../../src/game/colour";

let pacMan: PacMan;
let ghost: Ghost;

const testMap: GameMap = [
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 5, 1, 0, 1, 4, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 4, 1, 0, 1, 5, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
];

beforeEach(() => {
  pacMan = new PacMan({
    colour: Colour.yellow, spawnPosition: {at: {x: 3, y: 3}, direction: Direction.up}
  });
  ghost = new Ghost({
    colour: Colour.red, spawnPosition: {at: {x: 3, y: 3}, direction: Direction.up}
  });
});

test("Pac-Man rolls one from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 1, []);
  expect(result.length).toBe(1);
  expect(result[0].path?.length).toBe(0);
  expect(result).toEqual([{end: {x: 3, y: 2}, direction: Direction.up, path: []}] as Path[]);
});

test("Pac-Man rolls two from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 2, []);
  expect(result.length).toBe(1);
  expect(result[0].path?.length).toBe(1);
  expect(result).toEqual([{end: {x: 3, y: 1}, direction: Direction.up, path: [{x: 3, y: 2}]}] as Path[]);
});

test("Pac-Man rolls three from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 3, []);
  expect(result.length).toBe(2);
  arrayEquals(result, [{end: {x: 2, y: 1}, direction: Direction.left, path: [{x: 3, y: 2}, {x: 3, y: 1}]},
    {end: {x: 4, y: 1}, direction: Direction.right, path: [{x: 3, y: 2}, {x: 3, y: 1}]}]);
});

test("Pac-Man rolls four from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(2);
  arrayEquals(result, [{
    end: {x: 1, y: 1},
    direction: Direction.left,
    path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1}]
  }, {
    end: {x: 5, y: 1},
    direction: Direction.right,
    path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}]
  }]);
});

test("Pac-Man rolls five from start, should return four positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 5, []);
  expect(result.length).toBe(4);
  arrayEquals(result, [{
    end: {x: 5, y: 0},
    direction: Direction.up,
    path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}]
  }, {
    end: {x: 6, y: 1},
    direction: Direction.right,
    path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}]
  }, {
    end: {x: 1, y: 2},
    direction: Direction.down,
    path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}]
  }, {
    end: {x: 5, y: 2},
    direction: Direction.down,
    path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}]
  }
  ]);
});

test("Pac-Man rolls six from start, should return six positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result.length).toBe(6);
  arrayEquals(result, [
    {
      end: {x: 1, y: 3},
      direction: Direction.down,
      path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}]
    }, {
      end: {x: 0, y: 5},
      direction: Direction.right,
      path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 0}]
    }, {
      end: {x: 5, y: 3},
      direction: Direction.down,
      path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}]
    }, {
      end: {x: 7, y: 1},
      direction: Direction.right,
      path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}]
    }, {
      end: {x: 10, y: 5},
      direction: Direction.left,
      path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 0}]
    }, {
      end: {x: 5, y: 10},
      direction: Direction.up,
      path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 0}]
    }
  ]);
});

test("Pac-Man rolls four from position [5,1] (right), should return 11", () => {
  pacMan.follow({end: {x: 5, y: 1}, direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(11);
});

test("Pac-Man rolls four from position [5,1] (left), should return 12", () => {
  pacMan.follow({end: {x: 5, y: 1}, direction: Direction.left});
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(12);
});

test("Pac-Man rolls three from position [1,5] (left), should return 5", () => {
  pacMan.follow({end: {x: 1, y: 5}, direction: Direction.left});
  const result = possibleMovesAlgorithm(testMap, pacMan, 3, []);
  arrayEquals(result, [
    {end: {x: 1, y: 2}, direction: Direction.up, path: [{x: 1, y: 4}, {x: 1, y: 3}]},
    {end: {x: 1, y: 8}, direction: Direction.down, path: [{x: 1, y: 6}, {x: 1, y: 7}]},
    {end: {x: 5, y: 1}, direction: Direction.down, path: [{x: 0, y: 5}, {x: 5, y: 0}]},
    {end: {x: 9, y: 5}, direction: Direction.left, path: [{x: 0, y: 5}, {x: 10, y: 5}]},
    {end: {x: 5, y: 9}, direction: Direction.up, path: [{x: 0, y: 5}, {x: 5, y: 10}]},
  ]);
  expect(result.length).toBe(5);
});

test("Pac-Man rolls six from position [1,5] (down), should return 17", () => {
  pacMan.follow({end: {x: 1, y: 5}, direction: Direction.down});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result.length).toBe(21);
});

test("Pac-Man rolls six from position [7,1] (right), path to [9,5] should be five tiles long", () => {
  pacMan.follow({end: {x: 7, y: 1}, direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result[0].path?.length).toBe(5);
});

test("Pac-Man rolls 5 from position [9,3] (down), should return 7", () => {
  pacMan.follow({end: {x: 9, y: 3}, direction: Direction.down});
  const result = possibleMovesAlgorithm(testMap, pacMan, 5, []);
  expect(result.length).toBe(7);
});

test("Ghost can take Pac-Man, stops exactly on Pac-Man unless Pac-Man is at spawn", () => {
  ghost.follow({end: {x: 3, y: 5}, direction: Direction.up});
  const result = possibleMovesAlgorithm(testMap, ghost, 2, [ghost, pacMan]);
  expect(result.length).toBe(2);
  arrayEquals(result, [
    {end: {x: 1, y: 5}, direction: Direction.left, path: [{x: 2, y: 5}]},
    {end: {x: 5, y: 5}, direction: Direction.right, path: [{x: 4, y: 5}]},
  ])
});

test("Ghost can take Pac-Man, steps reach Pac-Man exactly", () => {
  ghost.follow({end: {x: 7, y: 3}, direction: Direction.up});
  pacMan.follow({end: {x: 5, y: 1}, direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, ghost, 4, [ghost, pacMan]);
  expect(result.length).toBe(2);
  arrayEquals(result, [
    {end: {x: 5, y: 1}, direction: Direction.left, path: [{x: 7, y: 2}, {x: 7, y: 1}, {x: 6, y: 1}]},
    {end: {x: 9, y: 1}, direction: Direction.right, path: [{x: 7, y: 2}, {x: 7, y: 1}, {x: 8, y: 1}]},
  ])
});

test("Ghost can take Pac-Man, steps overshoot Pac-Man", () => {
  ghost.follow({end: {x: 7, y: 3}, direction: Direction.up});
  pacMan.follow({end: {x: 5, y: 1}, direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, ghost, 6, [ghost, pacMan]);
  expect(result.length).toBe(2);
  arrayEquals(result, [
    {end: {x: 5, y: 1}, direction: Direction.left, path: [{x: 7, y: 2}, {x: 7, y: 1}, {x: 6, y: 1}]},
    {
      end: {x: 9, y: 3},
      direction: Direction.down,
      path: [{x: 7, y: 2}, {x: 7, y: 1}, {x: 8, y: 1}, {x: 9, y: 1}, {x: 9, y: 2}]
    },
  ])
});

function arrayEquals<T extends any[]>(result: T, expected: T, message?: string): void {
  for (const item of expected) {
    expect(result, message).toContainEqual(item);
  }
}
