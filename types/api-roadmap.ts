import { Account } from "./account";
import { FilteredList } from "./filtered-list";
import { PersonalizationOptions } from "./personalization-options";
import { Roadmap } from "./roadmap";
import { Topic } from "./topic";

export type Creator = Pick<Account, "id" | "name" | "avatar">;

// (1) definisikan tipe untuk progression summary
export interface RoadmapProgressionSummary {
  total_topics: number;
  finished_topics: number;
  completion_percentage: number;
  is_finished: boolean;
  finished_at: string;
  created_at: string;
  updated_at: string;
}

// (2) bangun tipe summary yang persis sesuai response `/profile/roadmaps`
export type RoadmapSummary = Roadmap & {
  is_bookmarked: boolean;
  progression: RoadmapProgressionSummary;
  personalization_options: PersonalizationOptions;
};

// (3) ganti ListRoadmapsOutput jadi list of RoadmapSummary
export type ListRoadmapsOutput = FilteredList<RoadmapSummary>;

export type GetRoadmapOutput = Roadmap & {
  creator: Creator;
  personalization_options: PersonalizationOptions;
  is_bookmarked: boolean;
  progression: RoadmapProgressionSummary;
  topics: Topic[];
};

export type GenerateRoadmapOutput = { slug: string };
