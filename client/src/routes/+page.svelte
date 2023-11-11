<script lang="ts">
    import { trpc } from '$lib/trpc';

    const clips = trpc.clips.getAll.query();
    const addClip = trpc.clips.add.mutation();
</script>

<div>
    <button
        class="m-3 transform rounded bg-cyan-900 px-3 py-2 text-white transition-transform active:scale-95"
        on:click={() => $addClip.mutate({ title: `test ${new Date().toISOString()}` })}
    >
        add clip
    </button>
</div>

<div>
    <div>
        {#if $clips.isSuccess}
            <h1 class="text-2xl">clips</h1>
            {#each $clips.data as clip}
                <span>
                    {clip.title}
                </span>
                <br />
            {/each}
        {/if}
    </div>
</div>
