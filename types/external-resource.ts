import { z } from "zod";

export const ExternalResourceSchema = z.object({
  title: z.string(),
  author: z.string(),
  url: z.string(),
  cover_url: z.string(),
  length: z.number(),
});

export type ExternalResource = z.infer<typeof ExternalResourceSchema>;

export default ExternalResource;
