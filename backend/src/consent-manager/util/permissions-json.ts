import * as z from 'zod';
export const permissionsSchema = z.object({
  permissions: z.array(z.string()),
});
export type PermissionsJson = z.infer<typeof permissionsSchema>;
