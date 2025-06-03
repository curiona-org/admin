import { ExternalResource } from "./external-resource";
import { Topic } from "./topic";

export type GetTopicBySlugOutput = Topic & {
  external_resources?: {
    books: ExternalResource[];
    youtube_videos: ExternalResource[];
    articles: ExternalResource[];
  };
};
