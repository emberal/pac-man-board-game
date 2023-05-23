import {test, expect, beforeEach} from "vitest";
import possibleMovesAlgorithm from "../../src/game/possibleMovesAlgorithm";
import {testMap} from "../../src/game/map";
import {Character, PacMan} from "../../src/game/character";

let pacMan: Character;

beforeEach(() => {
  pacMan = new PacMan("yellow", {x: 3, y: 3});
});

test("One from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 1);
  expect(result).toEqual([{x: 3, y: 2}]);
  expect(result.length).toBe(1);
});

test("Two from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 2);
  expect(result).toEqual([{x: 3, y: 1}]);
  expect(result.length).toBe(1);
});

test("Three from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 3);
  arrayEquals(result, [{x: 2, y: 1}, {x: 4, y: 1}]);
  expect(result.length).toBe(2);
});

test("Four from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 4);
  arrayEquals(result, [{x: 1, y: 1}, {x: 5, y: 1}]);
  expect(result.length).toBe(2);
});

test("Five from start, should return four positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 5);
  arrayEquals(result, [{x: 5, y: 0}, {x: 6, y: 1}, {x: 1, y: 2}, {x: 5, y: 2}]);
  expect(result.length).toBe(4);
});

test("Six from start, should return six positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 6);
  arrayEquals(result, [{x: 1, y: 3}, {x: 0, y: 5}, {x: 5, y: 3}, {x: 7, y: 1}, {x: 10, y: 5}, {x: 5, y: 10}]);
  expect(result.length).toBe(6);
});

test("Six from position [1,5], should return 14", () => {
  pacMan.moveTo({x: 1, y: 5});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6);
  // TODO add possible moves
  expect(result.length).toBe(14);
});

function arrayEquals<T extends any[]>(result: T, expected: T, message?: string): void {
  for (const item of expected) {
    expect(result, message).toContainEqual(item);
  }
}
