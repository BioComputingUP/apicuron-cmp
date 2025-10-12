import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const permissions = sqliteTable('PERMISSIONS', {
  id: integer().primaryKey({ autoIncrement: true }),
  identifier: text().notNull().unique(),
  name: text().notNull(),
  description: text().notNull(),
  user_id: integer().notNull(),
});

export const userConsents = sqliteTable('USER_CONSENTS', {
  id: integer().primaryKey({ autoIncrement: true }),
  last_update: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  first_declared: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  revision: integer().notNull(),
  // Permission information
  // permissions_json: text().notNull(),
  // User information
  user_orcidId: text(),
});

export const perimissionsRelations = relations(permissions, ({ one }) => ({
  user: one(userConsents, {
    fields: [permissions.id],
    references: [userConsents.id],
  }),
}));

export const userConsentsRelations = relations(userConsents, ({ many }) => ({
  permissions: many(permissions),
}));
