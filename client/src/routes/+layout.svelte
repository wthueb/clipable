<script lang="ts">
    import '../app.css';
    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import type { LayoutData } from './$types';
    import { trpc } from '$lib/trpc';
    import { webVitals } from '$lib/vitals';

    export let data: LayoutData;

    const queryClient = trpc.hydrateFromServer(data.trpc);

    function login() {
        console.log('try login');
    }

    $: if (browser && data?.analyticsId) {
        webVitals({
            path: $page.url.pathname,
            params: $page.params,
            analyticsId: data.analyticsId,
        });
    }
</script>

<QueryClientProvider client={queryClient}>
    <div class="min-h-screen">
        <nav class="flex w-screen justify-between bg-cyan-700 p-3">
            <div>
                <a href="/"><span>CLIPABLE</span></a>
            </div>
            <div>
                <button on:click={login}>LOGIN</button>
            </div>
        </nav>
        <main>
            <slot />
        </main>
        <footer class="absolute bottom-0 flex w-full items-center justify-center">
            <span class="text-xs text-zinc-600">&copy; William Huebner 2023</span>
        </footer>
    </div>
</QueryClientProvider>
