<script lang="ts">
    import '../app.css';

    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { inject } from '@vercel/analytics';
    import { dev } from '$app/environment';
    import { trpc } from '$lib/trpc';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    inject({ mode: dev ? 'development' : 'production' });

    const queryClient = trpc.hydrateFromServer(data.trpc);

    function login() {
        console.log('try login');
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
