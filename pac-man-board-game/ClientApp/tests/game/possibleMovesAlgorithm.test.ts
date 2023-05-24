import {test, expect, beforeEach} from "vitest";
import possibleMovesAlgorithm from "../../src/game/possibleMovesAlgorithm";
import {testMap} from "../../src/game/map";
import {Character, PacMan} from "../../src/game/character";

let pacMan: Character;

beforeEach(() => {
  pacMan = new PacMan("yellow", {end: {x: 3, y: 3}, direction: "up"});
});

test("Pac-Man rolls one from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 1);
  expect(result.length).toBe(1);
  expect(result).toEqual(getPath({at: {x: 3, y: 2}, direction: "up"}));
});

test("Pac-Man rolls two from start, should return one position", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 2);
  expect(result.length).toBe(1);
  expect(result).toEqual(getPath({at: {x: 3, y: 1}, direction: "up"}));
});

test("Pac-Man rolls three from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 3);
  expect(result.length).toBe(2);
  arrayEquals(result, getPath({at: {x: 2, y: 1}, direction: "left"}, {at: {x: 4, y: 1}, direction: "right"}));
});

test("Pac-Man rolls four from start, should return two positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 4);
  expect(result.length).toBe(2);
  arrayEquals(result, getPath({at: {x: 1, y: 1}, direction: "left"}, {at: {x: 5, y: 1}, direction: "right"}));
});

test("Pac-Man rolls five from start, should return four positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 5);
  expect(result.length).toBe(4);
  arrayEquals(result, getPath(
    {at: {x: 5, y: 0}, direction: "up"},
    {at: {x: 6, y: 1}, direction: "right"},
    {at: {x: 1, y: 2}, direction: "down"},
    {at: {x: 5, y: 2}, direction: "down"}
  ));
});

test("Pac-Man rolls six from start, should return six positions", () => {
  const result = possibleMovesAlgorithm(testMap, pacMan, 6);
  expect(result.length).toBe(6);
  arrayEquals(result, getPath(
    {at: {x: 1, y: 3}, direction: "down"},
    {at: {x: 0, y: 5}, direction: "right"},
    {at: {x: 5, y: 3}, direction: "down"},
    {at: {x: 7, y: 1}, direction: "right"},
    {at: {x: 10, y: 5}, direction: "left"},
    {at: {x: 5, y: 10}, direction: "up"}));
});

test("Pac-Man rolls six from position [1,5], should return 14", () => {
  pacMan.follow({end: {x: 1, y: 5}, direction: "down"});
  const result = possibleMovesAlgorithm(testMap, pacMan, 6);
  // TODO add possible moves
  expect(result.length).toBe(14); // TODO Oof
});

function getPath(...positions: DirectionalPosition[]): Path[] {
  return positions.map(pos => ({end: {x: pos.at.x, y: pos.at.y}, direction: pos.direction}));
}

function arrayEquals<T extends any[]>(result: T, expected: T, message?: string): void {
  for (const item of expected) {
    expect(result, message).toContainEqual(item);
  }
}
