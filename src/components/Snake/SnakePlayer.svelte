<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type {
    Dir,
    GridSettings,
    Point,
    DrawWithContextCallback,
    GameContext,
    GameManagerContext,
  } from "./SnakeCanvasTypes";
  import type { UpdateCallback } from "svelte-mainloop";
  import SpriteSheetData from "../../assets/snake/snake_spritesheet.json";

  type PlayerState = {
    dir: Dir;
    pos: { x: number; y: number };
    tail: { x: number; y: number }[];
  };

  type PlayerProps = {
    initalPlayerState: PlayerState;
    timeElapsed: number;
    apples: Point[];
  };
  let {
    apples = $bindable(),
    initalPlayerState,
    timeElapsed,
  }: PlayerProps = $props();
  let {
    gridSettings,
    drawTile,
    registerDraw,
    registerUpdate,
    deregisterDraw,
    deregisterUpdate,
  } = getContext<GameContext>("game");

  let { handleGameOver, incrementScore, getGameState, startGame } =
    getContext<GameManagerContext>("gameManager");
  let playerState = $state<PlayerState>(initalPlayerState);
  let cursorPos = $state<Point | undefined>(undefined);
  let nextDir: Dir = "RIGHT";
  let lastMove = 0;

  const detectAppleHit = (pos: Point) => {
    return apples.find((p) => p.x == pos.x && p.y == pos.y);
  };

  const detectCollisionWithSelf = (newPos: Point, tail: Point[]) => {
    return tail.find((p) => p.x == newPos.x && p.y == newPos.y);
  };

  const spawnRandomApple = () => {
    const pos = {
      x: Math.floor(Math.random() * gridSettings.width),
      y: Math.floor(Math.random() * gridSettings.height),
    };

    if (
      (playerState.pos.x == pos.x && playerState.pos.y == pos.y) ||
      playerState.tail.find(({ x, y }) => x == pos.x && y == pos.y)
    ) {
      return spawnRandomApple();
    }
    apples.push(pos);
  };

  const update: UpdateCallback = () => {
    if (getGameState() !== "PLAYING") return;
    if (timeElapsed - lastMove > 0.1) {
      const { pos, tail } = $state.snapshot(playerState);
      tail.push({ x: pos.x, y: pos.y });

      switch (nextDir) {
        case "UP":
          pos.y--;
          break;
        case "DOWN":
          pos.y++;
          break;
        case "LEFT":
          pos.x--;
          break;
        case "RIGHT":
          pos.x++;
          break;
      }
      if (pos.x > gridSettings.width - 1) {
        pos.x = 0;
      } else if (pos.x < 0) {
        pos.x = gridSettings.width - 1;
      } else if (pos.y < 0) {
        pos.y = gridSettings.height - 1;
      } else if (pos.y > gridSettings.height - 1) {
        pos.y = 0;
      }
      if (detectAppleHit(pos)) {
        apples = apples.filter((p) => p.x !== pos.x && p.y !== pos.y);
        incrementScore();
        spawnRandomApple();
      } else tail.shift();
      const collision = detectCollisionWithSelf(pos, tail);
      playerState.pos = pos;
      playerState.tail = tail;
      playerState.dir = nextDir;
      lastMove = timeElapsed;
      if (collision) {
        playerState = initalPlayerState;
        handleGameOver();
      }
    }
  };
  const draw: DrawWithContextCallback = () => {
    const { pos, dir, tail } = playerState;

    switch (dir) {
      case "UP":
        drawTile(pos, SpriteSheetData.head_up);
        break;

      case "DOWN":
        drawTile(pos, SpriteSheetData.head_down);
        break;

      case "LEFT":
        drawTile(pos, SpriteSheetData.head_left);
        break;

      case "RIGHT":
        drawTile(pos, SpriteSheetData.head_right);
        break;
      default:
        break;
    }
    let prevPos = pos;

    for (let i = tail.length - 1; i >= 0; i--) {
      const tailPos = tail[i];
      const relativeDir = getRelativeDir(prevPos, tailPos);
      if (i == 0) {
        switch (relativeDir) {
          case "UP":
            drawTile(tailPos, SpriteSheetData.tail_up);
            break;
          case "DOWN":
            drawTile(tailPos, SpriteSheetData.tail_down);
            break;
          case "LEFT":
            drawTile(tailPos, SpriteSheetData.tail_left);
            break;
          case "RIGHT":
            drawTile(tailPos, SpriteSheetData.tail_right);
            break;
        }
      } else {
        const tailPos = tail[i];
        const nextPos = tail[i - 1];
        const relativeDir = getRelativeDir(prevPos, tailPos);
        const relativeDirToNext = getRelativeDir(tailPos, nextPos);
        if (relativeDir == relativeDirToNext) {
          switch (relativeDir) {
            case "UP":
            case "DOWN":
              drawTile(tailPos, SpriteSheetData.body_vertical);
              break;
            case "LEFT":
            case "RIGHT":
              drawTile(tailPos, SpriteSheetData.body_horizontal);
              break;
          }
        } else {
          switch (relativeDir) {
            case "UP":
              switch (relativeDirToNext) {
                case "LEFT":
                  drawTile(tailPos, SpriteSheetData.body_bottomleft);
                  break;
                case "RIGHT":
                  drawTile(tailPos, SpriteSheetData.body_bottomright);
                  break;
              }
              break;
            case "DOWN":
              switch (relativeDirToNext) {
                case "LEFT":
                  drawTile(tailPos, SpriteSheetData.body_topleft);
                  break;
                case "RIGHT":
                  drawTile(tailPos, SpriteSheetData.body_topright);
                  break;
              }
              break;
            case "LEFT":
              switch (relativeDirToNext) {
                case "UP":
                  drawTile(tailPos, SpriteSheetData.body_topright);
                  break;
                case "DOWN":
                  drawTile(tailPos, SpriteSheetData.body_bottomright);
                  break;
              }
              break;
            case "RIGHT":
              switch (relativeDirToNext) {
                case "UP":
                  drawTile(tailPos, SpriteSheetData.body_topleft);
                  break;
                case "DOWN":
                  drawTile(tailPos, SpriteSheetData.body_bottomleft);
                  break;
              }
              break;
          }
        }
      }
      prevPos = tailPos;
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    const { key } = e;
    const { dir } = playerState;
    switch (key) {
      case "ArrowUp":
        e.preventDefault();
        if (dir !== "DOWN") {
          if (getGameState() == "START" || getGameState() == "GAME_OVER")
            startGame();
          nextDir = "UP";
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (dir !== "UP") {
          if (getGameState() == "START" || getGameState() == "GAME_OVER")
            startGame();
          nextDir = "DOWN";
        }
        break;

      case "ArrowLeft":
        e.preventDefault();
        if (dir !== "RIGHT") {
          if (getGameState() == "START" || getGameState() == "GAME_OVER")
            startGame();
          nextDir = "LEFT";
        }
        break;

      case "ArrowRight":
        e.preventDefault();
        if (dir !== "LEFT") {
          if (getGameState() == "START" || getGameState() == "GAME_OVER")
            startGame();
          nextDir = "RIGHT";
        }
        break;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!e.target || !(e.target instanceof HTMLElement)) return;
    if (e.target.tagName !== "CANVAS") return;
    e.preventDefault();
    const { clientX, clientY } = touch;
    cursorPos = { x: clientX, y: clientY };
  };
  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const { clientX, clientY } = touch;
    if (!cursorPos) return;
    const { dir } = playerState;
    const relX = clientX - cursorPos.x;
    const relY = clientY - cursorPos.y;
    if (Math.abs(relX) > Math.abs(relY)) {
      if (relX > 0) {
        if (dir !== "LEFT") {
          nextDir = "RIGHT";
        }
      } else {
        if (dir !== "RIGHT") {
          nextDir = "LEFT";
        }
      }
    } else {
      if (relY > 0) {
        if (dir !== "UP") {
          nextDir = "DOWN";
        }
      } else {
        if (dir !== "DOWN") {
          nextDir = "UP";
        }
      }
    }
    cursorPos = undefined;
  };

  onMount(() => {
    registerUpdate(update);
    registerDraw(draw);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouchStart);

    window.addEventListener("touchend", handleTouchEnd);
    spawnRandomApple();
    return () => {
      deregisterUpdate(update);
      deregisterDraw(draw);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  });

  const getRelativeDir = (
    p1: Point,
    p2: Point
  ): "UP" | "DOWN" | "LEFT" | "RIGHT" => {
    if (p1.x == p2.x) {
      if (p1.y == 0 && p2.y == gridSettings.height - 1) {
        return "UP";
      } else if (p2.y == 0 && p1.y == gridSettings.height - 1) {
        return "DOWN";
      }
    }
    if (p1.y == p2.y) {
      if (p1.x == 0 && p2.x == gridSettings.width - 1) {
        return "LEFT";
      } else if (p2.x == 0 && p1.x == gridSettings.width - 1) {
        return "RIGHT";
      }
    }

    const rel = {
      x: p2.x - p1.x,
      y: p2.y - p1.y,
    };
    if (rel.x == 0) {
      if (rel.y < 0) {
        return "UP";
      } else {
        return "DOWN";
      }
    } else {
      if (rel.x < 0) {
        return "LEFT";
      } else {
        return "RIGHT";
      }
    }
  };
</script>
