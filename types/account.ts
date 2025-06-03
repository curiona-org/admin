import { z } from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  method: z.string().optional(),
  email: z.string(),
  name: z.string(),
  avatar: z.string(),
  joined_at: z.coerce.date(),
});

export type Account = z.infer<typeof AccountSchema>;

export default Account;
