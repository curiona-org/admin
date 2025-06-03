import { z } from "zod";

export const RoadmapSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  total_topics: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Roadmap = z.infer<typeof RoadmapSchema>;

export default Roadmap;
