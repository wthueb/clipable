<script lang="ts">
    import { trpc } from '$lib/trpc';

    const clips = trpc.clips.getAll.query();
    const addClip = trpc.clips.add.mutation();
</script>

<div>
    dashboard

    <button on:click={() => $addClip.mutate({ title: 'test' })}> add clip </button>

    <div>
        {#if $clips.isSuccess}
            {#each $clips.data as clip}
                <span>
                    {clip.title}
                </span>
            {/each}
        {/if}
    </div>
</div>
