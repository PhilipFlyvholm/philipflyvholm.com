<script lang="ts">
  import { onMount, setContext } from "svelte";
  import type { GameManagerContext, GameState } from "./SnakeCanvasTypes";
  let { children } = $props();

  let gameState = $state<GameState>("START");
  let score = $state(0);
  let highScore = $state(0);
  const startGame = () => {
    gameState = "PLAYING";
    score = 0;
  };

  const handleGameOver = () => {
    gameState = "GAME_OVER";
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore.toString());
    }
  };
  const incrementScore = () => {
    score += 10;
  };

  setContext<GameManagerContext>("gameManager", {
    getGameState: () => gameState,
    getScore: () => score,
    getHighScore: () => highScore,
    startGame,
    handleGameOver,
    incrementScore,
  });
  onMount(() => {
    highScore = parseInt(localStorage.getItem("snakeHighScore") || "0");
  });
</script>

<div
  class="h-full w-full grid grid-cols-1 grid-rows-1 items-center place-items-stretch"
>
  <div class="col-start-1 row-start-1 bg-primary">
    {@render children?.()}
  </div>
  {#if gameState !== "PLAYING"}
    <div
      class="col-start-1 row-start-1 text-center bg-primary/50 h-full flex flex-col items-center justify-center"
    >
      {#if gameState === "START"}
        <h1 class="text-3xl">Snake Game</h1>
        <p class="text-center hidden md:block">Use arrow-keys to move</p>
        <p class="text-center block md:hidden">Swipe to move</p>
        <p>High Score: {highScore}</p>

        <button
          class="bg-primary px-5 py-2 rounded-full border-secondary hover:bg-secondary hover:text-light transition-colors border-4 my-3"
          onclick={startGame}>Start Game</button
        >
      {:else if gameState === "GAME_OVER"}
        <h1 class="text-3xl">Game Over!</h1>
        <p class="text-lg">Score: {score}</p>
        <p>High Score: {highScore}</p>
        <button
          class="bg-primary px-5 py-2 rounded-full border-secondary hover:bg-secondary hover:text-light transition-colors border-4 my-3"
          onclick={startGame}>Play again</button
        >
      {/if}
    </div>
  {/if}
</div>
