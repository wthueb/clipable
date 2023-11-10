import { trpcServer } from '$lib/server/server';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async (event) => {
    return {
        trpc: trpcServer.hydrateToClient(event),
        analyticsId: env.VERCEL_ANALYTICS_ID,
    };
};
