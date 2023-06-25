import {beforeEach, expect, test} from "vitest";
import possibleMovesAlgorithm from "../../src/game/possibleMovesAlgorithm";
import {testMap} from "../../src/game/map";
import {Character, PacMan} from "../../src/game/character";
import {Direction} from "../../src/game/direction";

let pacMan: Character;

beforeEach(() => {
  pacMan = new PacMan({
    Colour: "yellow", SpawnPosition: {At: {x: 3, y: 3}, Direction: Direction.up}
  });
});

test("Pac-Man rolls one from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 1, []);
  expect(result.length).toBe(1);
  expect(result[0].Path?.length).toBe(0);
  expect(result).toEqual([{end: {x: 3, y: 2}, direction: Direction.up, path: []}]);
});

test("Pac-Man rolls two from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 2, []);
  expect(result.length).toBe(1);
  expect(result[0].Path?.length).toBe(1);
  expect(result).toEqual([{end: {x: 3, y: 1}, direction: Direction.up, path: [{x: 3, y: 2}]}]);
});

test("Pac-Man rolls three from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 3, []);
  expect(result.length).toBe(2);
  arrayEquals(result, [{End: {x: 2, y: 1}, Direction: Direction.left, Path: [{x: 3, y: 2}, {x: 3, y: 1}]},
    {End: {x: 4, y: 1}, Direction: Direction.right, Path: [{x: 3, y: 2}, {x: 3, y: 1}]}]);
});

test("Pac-Man rolls four from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(2);
  arrayEquals(result, [{
    End: {x: 1, y: 1},
    Direction: Direction.left,
    Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1}]
  }, {
    End: {x: 5, y: 1},
    Direction: Direction.right,
    Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}]
  }]);
});

test("Pac-Man rolls five from start, should return four positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 5, []);
  expect(result.length).toBe(4);
  arrayEquals(result, [{
    End: {x: 5, y: 0},
    Direction: Direction.up,
    Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}]
  }, {
    End: {x: 6, y: 1},
    Direction: Direction.right,
    Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}]
  }, {
    End: {x: 1, y: 2},
    Direction: Direction.down,
    Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}]
  }, {
    End: {x: 5, y: 2},
    Direction: Direction.down,
    Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}]
  }
  ]);
});

test("Pac-Man rolls six from start, should return six positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result.length).toBe(6);
  arrayEquals(result, [
    {
      End: {x: 1, y: 3},
      Direction: Direction.down,
      Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}]
    }, {
      End: {x: 0, y: 5},
      Direction: Direction.right,
      Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 0}]
    }, {
      End: {x: 5, y: 3},
      Direction: Direction.down,
      Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}]
    }, {
      End: {x: 7, y: 1},
      Direction: Direction.right,
      Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}]
    }, {
      End: {x: 10, y: 5},
      Direction: Direction.left,
      Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 0}]
    }, {
      End: {x: 5, y: 10},
      Direction: Direction.up,
      Path: [{x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 0}]
    }
  ]);
});

test("Pac-Man rolls four from position [5,1] (right), should return 11", () => {
  pacMan.follow({End: {x: 5, y: 1}, Direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(11);
});

test("Pac-Man rolls four from position [5,1] (left), should return 12", () => {
  pacMan.follow({End: {x: 5, y: 1}, Direction: Direction.left});
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(12);
});

test("Pac-Man rolls three from position [1,5] (left), should return 5", () => {
  pacMan.follow({End: {x: 1, y: 5}, Direction: Direction.left});
  const result = possibleMovesAlgorithm(testMap, pacMan, 3, []);
  arrayEquals(result, [
    {End: {x: 1, y: 2}, Direction: Direction.up, Path: [{x: 1, y: 4}, {x: 1, y: 3}]},
    {End: {x: 1, y: 8}, Direction: Direction.down, Path: [{x: 1, y: 6}, {x: 1, y: 7}]},
    {End: {x: 5, y: 1}, Direction: Direction.down, Path: [{x: 0, y: 5}, {x: 5, y: 0}]},
    {End: {x: 9, y: 5}, Direction: Direction.left, Path: [{x: 0, y: 5}, {x: 10, y: 5}]},
    {End: {x: 5, y: 9}, Direction: Direction.up, Path: [{x: 0, y: 5}, {x: 5, y: 10}]},
  ]);
  expect(result.length).toBe(5);
});

test("Pac-Man rolls six from position [1,5] (down), should return 17", () => {
  pacMan.follow({End: {x: 1, y: 5}, Direction: Direction.down});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result.length).toBe(17);
});

test("Pac-Man rolls six from position [7,1] (right), path to [9,5] should be five tiles long", () => {
  pacMan.follow({End: {x: 7, y: 1}, Direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result[0].Path?.length).toBe(5);
});

test("Pac-Man rolls 5 from position [9,3] (down), should return 5", () => {
  pacMan.follow({End: {x: 9, y: 3}, Direction: Direction.down});
  const result = possibleMovesAlgorithm(testMap, pacMan, 5, []);
  expect(result.length).toBe(5);
});

function arrayEquals<T extends any[]>(result: T, expected: T, message?: string): void {
  for (const item of expected) {
    expect(result, message).toContainEqual(item);
  }
}
