import { z } from "zod";

export const TopicSchema = z.object({
  id: z.number(),
  roadmap_id: z.number(),
  parent_id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  pro_tips: z.string(),
  order: z.number(),
  is_finished: z.boolean(),
  external_search_query: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Topic = z.infer<typeof TopicSchema> & {
  subtopics: Topic[];
};

export default Topic;
