<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type {
    DrawWithContextCallback,
    GameContext,
    Point,
  } from "./SnakeCanvasTypes";
  import SpriteSheetData from "../../assets/snake/snake_spritesheet.json";

  type AppleProps = {
    pos: Point;
  };
  let { pos }: AppleProps = $props();

  let { drawTile, registerDraw, deregisterDraw } =
    getContext<GameContext>("game");

  const draw: DrawWithContextCallback = () => {
    drawTile(pos, SpriteSheetData.apple);
  };

  onMount(() => {
    registerDraw(draw);
    return () => {
      deregisterDraw(draw);
    };
  });
</script>
