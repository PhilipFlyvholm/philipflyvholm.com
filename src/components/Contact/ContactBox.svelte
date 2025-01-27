<script lang="ts">
  import type { Snippet } from "svelte";

  let rotationVelocity = $state<number>(0);
  let rotation = $state<number>(0);
  let text = $state<string>("My socials");

  $effect(() => {
    const interval = setInterval(() => {
      rotation = (rotation + rotationVelocity) % 360;
      rotationVelocity = Math.max(
        Math.round(rotation % 120) == 0
          ? 0
          : (120 - Math.round(rotation % 120)) / 120,
        rotationVelocity - 0.1
      );
    }, 1000 / 60);

    return () => clearInterval(interval);
  });

  function resetText() {
    text = "My socials";
  }
</script>

{#snippet LinkedInIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    class="p-1"
    ><path
      fill="currentColor"
      d="M27.26 27.271h-4.733v-7.427c0-1.771-.037-4.047-2.475-4.047c-2.468 0-2.844 1.921-2.844 3.916v7.557h-4.739V11.999h4.552v2.083h.061c.636-1.203 2.183-2.468 4.491-2.468c4.801 0 5.692 3.161 5.692 7.271v8.385zM7.115 9.912a2.75 2.75 0 0 1-2.751-2.756a2.753 2.753 0 1 1 2.751 2.756m2.374 17.359H4.74V12h4.749zM29.636 0H2.36C1.057 0 0 1.031 0 2.307v27.387c0 1.276 1.057 2.307 2.36 2.307h27.271c1.301 0 2.369-1.031 2.369-2.307V2.307C32 1.031 30.932 0 29.631 0z"
    /></svg
  >
{/snippet}

{#snippet GithubIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    /></svg
  >
{/snippet}

{#snippet BlueSkyIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><rect width="24" height="24" fill="none" /><path
      fill="currentColor"
      d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8"
    /></svg
  >
{/snippet}
{#snippet ButtonArm(
  relativeRotation: number,
  icon: Snippet,
  href: string,
  hoverText: string
)}
  <div
    class={`w-12 h-6 bg-secondary left-1/2 top-1/2 absolute -translate-y-1/2 rotate-[var(--armRotation)] origin-left`}
    style="--armRotation: {relativeRotation}deg; --inverseArmRotation: -{relativeRotation +
      rotation}deg;"
  >
    <a
      onmouseenter={() => (text = hoverText)}
      onmouseleave={resetText}
      {href}
      target="_blank"
      class="w-10 h-10 flex justify-center items-center transition-colors bg-primary hover:bg-secondary text-secondary hover:text-primary rounded-full border-secondary border-4 absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[var(--inverseArmRotation)]"
    >
      {@render icon()}
    </a>
  </div>
{/snippet}

<p class="text-center {text.length > 20 ? 'text-sm leading-4' : ''}">{text}</p>
<div
  class="flex items-center justify-center h-full w-full rotate-[var(--containerRotation)] drop-shadow-lg min-h-[200px]"
  style="--containerRotation: {rotation}deg"
>
  <div
    class="w-5 h-5 bg-primary rounded-full border-secondary border-4 relative"
  >
    {@render ButtonArm(
      30,
      LinkedInIcon,
      "https://www.linkedin.com/in/philipflyvholm",
      "Let's connect!"
    )}
    {@render ButtonArm(
      150,
      BlueSkyIcon,
      "https://bsky.app/profile/philipflyvholm.bsky.social",
      "See what's brewing!"
    )}
    {@render ButtonArm(
      270,
      GithubIcon,
      "https://github.com/PhilipFlyvholm",
      "Check out my code!"
    )}
    <button
      class="w-10 h-10 transition-colors bg-primary hover:bg-secondary text-secondary hover:text-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-secondary border-4 -rotate-[var(--containerRotation)] text-xs font-bold leading-3"
      onmouseover={() =>
        (text = rotationVelocity > 0.5 ? "Yay!" : "Give it ago!")}
      onfocus={() => (text = "Give it ago!")}
      onmouseleave={resetText}
      onclick={() => {
        rotationVelocity = Math.min(rotationVelocity + 15, 50);
      }}
      >{rotationVelocity > 40
        ? "🤢"
        : rotationVelocity > 35
          ? "😲"
          : rotationVelocity > 10
            ? "😄"
            : rotationVelocity > 2
              ? "😴"
              : "Spin me!"}</button
    >
  </div>
</div>

<style>
</style>
