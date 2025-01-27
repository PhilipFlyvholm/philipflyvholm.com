import type { DrawCallback, UpdateCallback } from "svelte-mainloop";

export type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type DrawWithContextCallback = (
  context: CanvasRenderingContext2D,
  interpolatedPercentage: number
) => void;
export interface Point {
  x: number;
  y: number;
}
export type GridSettings = {
  width: number;
  height: number;
  cellSize: number;
};

export type GameContext = {
  gridSettings: GridSettings;
  registerUpdate: (f: UpdateCallback) => void;
  registerDraw: (f: DrawWithContextCallback) => void;
  deregisterDraw: (f: DrawWithContextCallback) => void;
  deregisterUpdate: (f: UpdateCallback) => void;
  drawTile: (pos: Point, source: Point) => void;
};

export type GameState = "START" | "PLAYING" | "GAME_OVER";
export type GameManagerContext = {
  getGameState: () => GameState;
  getScore: () => number;
  getHighScore: () => number;
  startGame: () => void;
  handleGameOver: () => void;
  incrementScore: () => void;
};
