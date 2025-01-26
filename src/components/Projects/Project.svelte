<script lang="ts">
  import type { CollectionEntry } from "astro:content";
  let { project }: { project: CollectionEntry<"projects"> } = $props();
</script>

<div
  class="bg-accent border-[1px] border-gray rounded-lg h-full min-w-[30%] flex flex-col overflow-hidden snap-center"
>
  <div class="flex-1 flex flex-col px-2 justify-center">
    <div class="flex-1 pt-1">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold">{project.data.title}</h2>
        {#if project.data.icon}
          {#if project.data.icon.type == "image"}
            {@const img = project.data.icon.src}
            <img
              src={img.src}
              alt={`Icon of ${project.data.title}`}
              width={img.width}
              height={img.height}
              loading="lazy"
              decoding="async"
              class="w-auto h-5 rounded"
            />{/if}
        {/if}
      </div>
      <p>{project.data.description}</p>
    </div>
    {#if project.data.links}
      <p class="text-sm">
        {#each project.data.links as { href, text, openInNewPage }, i}
          <a class="underline" {href} target={openInNewPage ? "_blank" : ""}>
            {text}
          </a>
          {#if i < project.data.links.length - 1}
            <span class="m-0.5"> | </span>
          {/if}
        {/each}
      </p>
    {/if}
  </div>
  <div class="px-2 pb-2 pt-1">
    <img
      src={project.data.cover.src}
      alt={project.data.coverAlt}
      width={project.data.cover.width}
      height={project.data.cover.height}
      loading="lazy"
      decoding="async"
      class="shadow-md rounded aspect-video"
    />
  </div>
</div>
