import { FilteredList } from "./filtered-list";

type RoadmapStatisticOutput = {
  id: number;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type GetStatisticsOutput = {
  user: {
    users_registered_count: number;
  };
  roadmap: {
    roadmaps_generated_count: number;
    roadmaps_generated_today_count: number;
    roadmaps_ongoing_count: number;
    roadmaps_finished_count: number;
    highest_rated_roadmap: RoadmapStatisticOutput & {
      rating: number;
      rating_count: number;
    };
    most_bookmarked_roadmap: RoadmapStatisticOutput & {
      bookmark_count: number;
    };
    most_active_roadmap: RoadmapStatisticOutput & {
      activity_count: number;
    };
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

export type ListRoadmapRatingsOutput = FilteredList<{
  is_rated: boolean;
  account_id: number;
  roadmap_id: number;
  progression_total_topics: number;
  progression_total_finished_topics: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: {
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
