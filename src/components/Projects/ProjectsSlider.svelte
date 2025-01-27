<script lang="ts">
  import type { CollectionEntry } from "astro:content";
  import Project from "./Project.svelte";
  let { projects }: { projects: CollectionEntry<"projects">[] } = $props();

  let leftScroll = $state(0);
  let carousel = $state.raw<HTMLElement>();
  const showPrevArrow = $derived(leftScroll <= 0);
  const showNextArrow = $derived(
    carousel && leftScroll >= carousel?.scrollWidth - carousel?.offsetWidth - 1
  );

  function scrollNext() {
    if (!carousel) return;
    const scrollAmount = carousel.getBoundingClientRect().width;

    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  function scrollPrev() {
    if (!carousel) return;
    const scrollAmount = carousel.getBoundingClientRect().width;
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }

  function handleScroll() {
    if (!carousel) return;
    leftScroll = carousel.scrollLeft;
  }
  $effect(() => {
    if (!carousel) return;
    carousel.addEventListener("scroll", handleScroll);
    return () => {
      if (!carousel) return;
      carousel.removeEventListener("scroll", handleScroll);
    };
  });
</script>

{#snippet ArrowLeft()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-3 h-full"
    viewBox="0 0 1024 1024"
  >
    <path
      fill="currentColor"
      d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0"
    />
  </svg>
{/snippet}

{#snippet ArrowRight()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-3 h-full"
    viewBox="0 0 1024 1024"
  >
    <path
      fill="currentColor"
      d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0"
    />
  </svg>
{/snippet}

<button
  class={`transition-opacity ${showPrevArrow ? "opacity-0 cursor-default" : "opacity-100"}`}
  onclick={scrollPrev}>{@render ArrowLeft()}</button
>
<div
  class="flex overflow-scroll h-full space-x-4 scroll-smooth snap-x snap-mandatory"
  bind:this={carousel}
>
  {#each projects as project}
    <Project {project} />
  {/each}
</div>

<button
  class={`transition-opacity px-2 ${showNextArrow ? "opacity-0 cursor-default" : "opacity-100"}`}
  onclick={scrollNext}>{@render ArrowRight()}</button
>
