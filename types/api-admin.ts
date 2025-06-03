import { FilteredList } from "./filtered-list";

export type GetStatisticsOutput = {
  user: {
    users_registered_count: number;
  };
  roadmap: {
    roadmaps_generated_count: number;
    roadmaps_ongoing_count: number;
    roadmaps_finished_count: number;
  };
};

export type GetUserOutput = {
  id: number;
  method: string;
  email: string;
  name: string;
  avatar: string;
  total_roadmaps: number;
  is_suspended: boolean;
  is_admin: boolean;
  joined_at: string;
  roadmaps: FilteredList<{
    id: number;
    title: string;
    slug: string;
    description: string;
    total_topics: number;
    total_bookmarks: number;
    created_at: string;
    updated_at: string;
    personalization_options: {
      daily_time_availability: {
        value: number;
        unit: "minutes" | "hours" | "days" | "weeks" | "months";
      };
      total_duration: {
        value: number;
        unit: "minutes" | "hours" | "days" | "weeks" | "months";
      };
      skill_level: "beginner" | "intermediate" | "advanced";
    };
    progression: RoadmapProgressionSummary;
  }>;
};

export type GetRoadmapOutput = {
  id: number;
  title: string;
  slug: string;
  description: string;
  total_topics: number;
  total_bookmarks: number;
  created_at: string;
  updated_at: string;
  personalization_options: {
    daily_time_availability: {
      value: number;
      unit: "minutes" | "hours" | "days" | "weeks" | "months";
    };
    total_duration: {
      value: number;
      unit: "minutes" | "hours" | "days" | "weeks" | "months";
    };
    skill_level: "beginner" | "intermediate" | "advanced";
  };
  creator: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    is_suspended: boolean;
    joined_at: string;
  };
  progression: RoadmapProgressionSummary;
  topics: Topic[];
};

export type ListUsersOutput = FilteredList<GetUserOutput>;

export type ListRoadmapsOutput = FilteredList<{
  id: number;
  title: string;
  slug: string;
  description: string;
  total_topics: number;
  total_bookmarks: number;
  created_at: string;
  updated_at: string;
  personalization_options: {
    daily_time_availability: {
      value: number;
      unit: "minutes" | "hours" | "days" | "weeks" | "months";
    };
    total_duration: {
      value: number;
      unit: "minutes" | "hours" | "days" | "weeks" | "months";
    };
    skill_level: "beginner" | "intermediate" | "advanced";
  };
  creator: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    is_suspended: boolean;
    joined_at: string;
  };
}>;

export type RoadmapProgressionSummary = {
  total_topics: number;
  finished_topics: number;
  completion_percentage: number;
  is_finished: boolean;
  finished_at: string;
  created_at: string;
  updated_at: string;
};

export type Topic = {
  id: number;
  roadmap_id: number;
  parent_id: number;
  title: string;
  slug: string;
  description: string;
  pro_tips: string;
  order: number;
  is_finished: boolean;
  finished_at: string;
  external_search_query: string;
  subtopics: Topic[];
  created_at: string;
  updated_at: string;
};
