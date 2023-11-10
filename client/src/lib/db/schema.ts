import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: serial('id').primaryKey(),
    name: text('name'),
});

export const clip = pgTable('clip', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    url: text('url').notNull(),
    userId: serial('user_id').references(() => user.id),
});
