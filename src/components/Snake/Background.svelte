<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type {
    DrawWithContextCallback,
    GameContext,
  } from "./SnakeCanvasTypes";

  const { gridSettings, registerDraw, deregisterDraw } =
    getContext<GameContext>("game");
  const draw: DrawWithContextCallback = (context) => {
    for (let i = 0; i < gridSettings.width; i++) {
      for (let j = 0; j < gridSettings.height; j++) {
        const x = gridSettings.cellSize * i;
        const y = gridSettings.cellSize * j;
        context.fillStyle = (j + i) % 2 == 0 ? "#EDE8D5" : "#F4F0E6";
        context.fillRect(x, y, gridSettings.cellSize, gridSettings.cellSize);
      }
    }
  };

  onMount(() => {
    registerDraw(draw);
    console.log(gridSettings);

    return () => deregisterDraw(draw);
  });
</script>
