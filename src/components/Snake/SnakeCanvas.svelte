<script lang="ts">
  import { onMount, setContext } from "svelte";
  import {
    JoinLoop,
    type DrawCallback,
    type UpdateCallback,
  } from "svelte-mainloop";
  import SpriteSheetImg from "../../assets/snake/snake_spritesheet.png";
  import SnakePlayer from "./SnakePlayer.svelte";
  import type {
    DrawWithContextCallback,
    GameContext,
    GridSettings,
    Point,
  } from "./SnakeCanvasTypes";
  import Background from "./Background.svelte";
  import Apple from "./Apple.svelte";
  import GameManager from "./GameManager.svelte";
  let timeElapsed = $state(0);
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let spriteSheetImg = $state<HTMLImageElement>();
  let gridSettings: GridSettings = {
    width: 25,
    height: 10,
    cellSize: 25,
  };

  let apples = $state<Point[]>([]);
  let updateCallbacks: UpdateCallback[] = [];
  const registerUpdate = (f: UpdateCallback) => updateCallbacks.push(f);
  const deregisterUpdate = (f: UpdateCallback) =>
    (updateCallbacks = updateCallbacks.filter((g) => f !== g));
  let drawCallbacks: DrawWithContextCallback[] = [];

  const registerDraw = (f: DrawWithContextCallback) => drawCallbacks.push(f);
  const deregisterDraw = (f: DrawWithContextCallback) =>
    (drawCallbacks = drawCallbacks.filter((g) => f !== g));
  const update: UpdateCallback = (delta) => {
    timeElapsed += delta;
    for (const f of updateCallbacks) {
      f(delta);
    }
  };

  const draw: DrawCallback = (interpolationPercentage: number) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCallbacks.forEach((f) => f(context, interpolationPercentage));
  };

  const drawTile = (pos: Point, source: Point) => {
    if (!spriteSheetImg) {
      return;
    }

    context.drawImage(
      spriteSheetImg,
      source.x * 40,
      source.y * 40,
      40,
      40,
      pos.x * 25,
      pos.y * 25,
      25,
      25
    );
  };

  const loadSpriteSheet = async () => {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = SpriteSheetImg.src;
      img.addEventListener("load", () => {
        console.log("Image loaded");

        resolve(img);
      });
    });
  };

  setContext<GameContext>("game", {
    gridSettings,
    registerDraw,
    registerUpdate,
    deregisterDraw,
    deregisterUpdate,
    drawTile,
  });

  onMount(async () => {
    const tmpContext = canvas.getContext("2d");
    if (tmpContext) context = tmpContext;
    setContext("canvasContext", context);
    setContext("timeElapsed", timeElapsed);

    spriteSheetImg = await loadSpriteSheet();
  });
</script>

<GameManager>
  <JoinLoop {update} {draw} />
  <canvas
    bind:this={canvas}
    width={gridSettings.cellSize * gridSettings.width}
    height={gridSettings.cellSize * gridSettings.height}
  >
  </canvas>
  <Background />
  {#each apples as pos}
    <Apple {pos} />
  {/each}
  <SnakePlayer
    {timeElapsed}
    bind:apples
    initalPlayerState={{
      dir: "RIGHT",
      pos: {
        x: Math.floor(gridSettings.width / 2),
        y: Math.floor(gridSettings.height / 2),
      },
      tail: [
        {
          x: Math.floor(gridSettings.width / 2) - 3,
          y: Math.floor(gridSettings.height / 2),
        },
        {
          x: Math.floor(gridSettings.width / 2) - 2,
          y: Math.floor(gridSettings.height / 2),
        },
        {
          x: Math.floor(gridSettings.width / 2) - 1,
          y: Math.floor(gridSettings.height / 2),
        },
      ],
    }}
  />
</GameManager>

<style>
  /* Make it responsive
  */
  canvas {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
    touch-action: none;
  }
</style>
