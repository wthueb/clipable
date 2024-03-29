/// <reference types="@sveltejs/kit" />
/// <reference types="@cloudflare/workers-types" />

declare namespace App {
    interface Platform {
        env: {
            // KV: KVNamespace;
        };
        context: ExecutionContext;
    }

    interface Locals {
        supabase: import('@supabase/supabase-js').SupabaseClient;
        getSession: () => Promise<import('@supabase/supabase-js').AuthSession | null>;
    }
    // interface Error {}
    // interface Session {}
    // interface Stuff {}
}
