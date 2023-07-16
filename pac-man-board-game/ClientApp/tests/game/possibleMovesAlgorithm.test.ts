import {beforeEach, expect, test} from "vitest";
import possibleMovesAlgorithm from "../../src/game/possibleMovesAlgorithm";
import {testMap} from "../../src/game/map";
import {Ghost, PacMan} from "../../src/game/character";
import {Direction} from "../../src/game/direction";
import {Colour} from "../../src/game/colour";

let pacMan: PacMan;
let ghost: Ghost;

beforeEach(() => {
  pacMan = new PacMan({
    Colour: Colour.Yellow, SpawnPosition: {At: {X: 3, Y: 3}, Direction: Direction.up}
  });
  ghost = new Ghost({
    Colour: Colour.Red, SpawnPosition: {At: {X: 3, Y: 3}, Direction: Direction.up}
  });
});

test("Pac-Man rolls one from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 1, []);
  expect(result.length).toBe(1);
  expect(result[0].Path?.length).toBe(0);
  expect(result).toEqual([{End: {X: 3, Y: 2}, Direction: Direction.up, Path: []}] as Path[]);
});

test("Pac-Man rolls two from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 2, []);
  expect(result.length).toBe(1);
  expect(result[0].Path?.length).toBe(1);
  expect(result).toEqual([{End: {X: 3, Y: 1}, Direction: Direction.up, Path: [{X: 3, Y: 2}]}] as Path[]);
});

test("Pac-Man rolls three from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 3, []);
  expect(result.length).toBe(2);
  arrayEquals(result, [{End: {X: 2, Y: 1}, Direction: Direction.left, Path: [{X: 3, Y: 2}, {X: 3, Y: 1}]},
    {End: {X: 4, Y: 1}, Direction: Direction.right, Path: [{X: 3, Y: 2}, {X: 3, Y: 1}]}]);
});

test("Pac-Man rolls four from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(2);
  arrayEquals(result, [{
    End: {X: 1, Y: 1},
    Direction: Direction.left,
    Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 2, Y: 1}]
  }, {
    End: {X: 5, Y: 1},
    Direction: Direction.right,
    Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}]
  }]);
});

test("Pac-Man rolls five from start, should return four positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 5, []);
  expect(result.length).toBe(4);
  arrayEquals(result, [{
    End: {X: 5, Y: 0},
    Direction: Direction.up,
    Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}]
  }, {
    End: {X: 6, Y: 1},
    Direction: Direction.right,
    Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}]
  }, {
    End: {X: 1, Y: 2},
    Direction: Direction.down,
    Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 2, Y: 1}, {X: 1, Y: 1}]
  }, {
    End: {X: 5, Y: 2},
    Direction: Direction.down,
    Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}]
  }
  ]);
});

test("Pac-Man rolls six from start, should return six positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result.length).toBe(6);
  arrayEquals(result, [
    {
      End: {X: 1, Y: 3},
      Direction: Direction.down,
      Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 2, Y: 1}, {X: 1, Y: 1}, {X: 1, Y: 2}]
    }, {
      End: {X: 0, Y: 5},
      Direction: Direction.right,
      Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}, {X: 5, Y: 0}]
    }, {
      End: {X: 5, Y: 3},
      Direction: Direction.down,
      Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}, {X: 5, Y: 2}]
    }, {
      End: {X: 7, Y: 1},
      Direction: Direction.right,
      Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}, {X: 6, Y: 1}]
    }, {
      End: {X: 10, Y: 5},
      Direction: Direction.left,
      Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}, {X: 5, Y: 0}]
    }, {
      End: {X: 5, Y: 10},
      Direction: Direction.up,
      Path: [{X: 3, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}, {X: 5, Y: 1}, {X: 5, Y: 0}]
    }
  ]);
});

test("Pac-Man rolls four from position [5,1] (right), should return 11", () => {
  pacMan.follow({End: {X: 5, Y: 1}, Direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(11);
});

test("Pac-Man rolls four from position [5,1] (left), should return 12", () => {
  pacMan.follow({End: {X: 5, Y: 1}, Direction: Direction.left});
  const result = possibleMovesAlgorithm(testMap, pacMan, 4, []);
  expect(result.length).toBe(12);
});

test("Pac-Man rolls three from position [1,5] (left), should return 5", () => {
  pacMan.follow({End: {X: 1, Y: 5}, Direction: Direction.left});
  const result = possibleMovesAlgorithm(testMap, pacMan, 3, []);
  arrayEquals(result, [
    {End: {X: 1, Y: 2}, Direction: Direction.up, Path: [{X: 1, Y: 4}, {X: 1, Y: 3}]},
    {End: {X: 1, Y: 8}, Direction: Direction.down, Path: [{X: 1, Y: 6}, {X: 1, Y: 7}]},
    {End: {X: 5, Y: 1}, Direction: Direction.down, Path: [{X: 0, Y: 5}, {X: 5, Y: 0}]},
    {End: {X: 9, Y: 5}, Direction: Direction.left, Path: [{X: 0, Y: 5}, {X: 10, Y: 5}]},
    {End: {X: 5, Y: 9}, Direction: Direction.up, Path: [{X: 0, Y: 5}, {X: 5, Y: 10}]},
  ]);
  expect(result.length).toBe(5);
});

test("Pac-Man rolls six from position [1,5] (down), should return 17", () => {
  pacMan.follow({End: {X: 1, Y: 5}, Direction: Direction.down});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result.length).toBe(21);
});

test("Pac-Man rolls six from position [7,1] (right), path to [9,5] should be five tiles long", () => {
  pacMan.follow({End: {X: 7, Y: 1}, Direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6, []);
  expect(result[0].Path?.length).toBe(5);
});

test("Pac-Man rolls 5 from position [9,3] (down), should return 7", () => {
  pacMan.follow({End: {X: 9, Y: 3}, Direction: Direction.down});
  const result = possibleMovesAlgorithm(testMap, pacMan, 5, []);
  expect(result.length).toBe(7);
});

test("Ghost can take Pac-Man, stops exactly on Pac-Man unless Pac-Man is at spawn", () => {
  ghost.follow({End: {X: 3, Y: 5}, Direction: Direction.up});
  const result = possibleMovesAlgorithm(testMap, ghost, 2, [ghost, pacMan]);
  expect(result.length).toBe(2);
  arrayEquals(result, [
    {End: {X: 1, Y: 5}, Direction: Direction.left, Path: [{X: 2, Y: 5}]},
    {End: {X: 5, Y: 5}, Direction: Direction.right, Path: [{X: 4, Y: 5}]},
  ])
});

test("Ghost can take Pac-Man, steps reach Pac-Man exactly", () => {
  ghost.follow({End: {X: 7, Y: 3}, Direction: Direction.up});
  pacMan.follow({End: {X: 5, Y: 1}, Direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, ghost, 4, [ghost, pacMan]);
  expect(result.length).toBe(2);
  arrayEquals(result, [
    {End: {X: 5, Y: 1}, Direction: Direction.left, Path: [{X: 7, Y: 2}, {X: 7, Y: 1}, {X: 6, Y: 1}]},
    {End: {X: 9, Y: 1}, Direction: Direction.right, Path: [{X: 7, Y: 2}, {X: 7, Y: 1}, {X: 8, Y: 1}]},
  ])
});

test("Ghost can take Pac-Man, steps overshoot Pac-Man", () => {
  ghost.follow({End: {X: 7, Y: 3}, Direction: Direction.up});
  pacMan.follow({End: {X: 5, Y: 1}, Direction: Direction.right});
  const result = possibleMovesAlgorithm(testMap, ghost, 6, [ghost, pacMan]);
  expect(result.length).toBe(2);
  arrayEquals(result, [
    {End: {X: 5, Y: 1}, Direction: Direction.left, Path: [{X: 7, Y: 2}, {X: 7, Y: 1}, {X: 6, Y: 1}]},
    {
      End: {X: 9, Y: 3},
      Direction: Direction.down,
      Path: [{X: 7, Y: 2}, {X: 7, Y: 1}, {X: 8, Y: 1}, {X: 9, Y: 1}, {X: 9, Y: 2}]
    },
  ])
});

function arrayEquals<T extends any[]>(result: T, expected: T, message?: string): void {
  for (const item of expected) {
    expect(result, message).toContainEqual(item);
  }
}
