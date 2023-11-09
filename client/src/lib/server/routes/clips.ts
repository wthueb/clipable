import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '$lib/db';
import { clip } from '$lib/db/schema';

export const clipsRouter = router({
    getAll: publicProcedure.query(async () => {
        return await db.query.clip.findMany();
    }),

    add: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
            }),
        )
        .mutation(async ({ input }) => {
            await db.insert(clip).values({
                title: input.title,
                url: 'http://test.com',
                userId: 1,
            });
        }),
});
