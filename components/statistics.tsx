import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GetStatisticsOutput } from "@/types/api-admin";
import Link from "next/link";

type StatisticsProps = {
  data: GetStatisticsOutput;
};

export function Statistics({ data }: StatisticsProps) {
  return (
    <div className='grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 px-4 lg:px-6'>
      <StatisticsCard
        title='Total Roadmaps Generated'
        description='The total number of roadmaps created in the system.'
        value={data.roadmap.roadmaps_generated_count}
        className='from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCard
        title='Total Roadmaps in Progress'
        description='The total number of roadmaps people are currently working on.'
        value={data.roadmap.roadmaps_ongoing_count}
        className='from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCard
        title='Total Roadmaps Completed'
        description='The total number of roadmaps that users have successfully completed.'
        value={data.roadmap.roadmaps_finished_count}
        className='from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCard
        title='Total Accounts Registered'
        description='The total number of user accounts registered in the system.'
        value={data.user.users_registered_count}
        className='from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCardLink
        href={`/dashboard/roadmap/${data.roadmap.highest_rated_roadmap.id}`}
        title='Highest Rated Roadmap'
        description={
          <span>
            {data.roadmap.highest_rated_roadmap.rating} / 5 (
            {data.roadmap.highest_rated_roadmap.rating_count} rating
            {data.roadmap.highest_rated_roadmap.rating_count > 1 ? "s" : ""})
          </span>
        }
        value={data.roadmap.highest_rated_roadmap.title}
        className='from-green-300/40 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCard
        title='Roadmaps Generated Today'
        description='The number of roadmaps generated today.'
        value={data.roadmap.roadmaps_generated_today_count}
        className='from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCard
        title='Total Accounts Registered'
        description='The total number of user accounts registered in the system.'
        value={data.user.users_registered_count}
        className='from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCardLink
        href={`/dashboard/roadmap/${data.roadmap.most_active_roadmap.id}`}
        title='Most Active Roadmap'
        description={`${data.roadmap.most_active_roadmap.activity_count} are currently working on this roadmap.`}
        value={data.roadmap.most_active_roadmap.title}
        className='from-blue-300/40 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
      <StatisticsCardLink
        href={`/dashboard/roadmap/${data.roadmap.most_bookmarked_roadmap.id}`}
        title='Most Saved Roadmap'
        description={`${data.roadmap.most_bookmarked_roadmap.bookmark_count} Bookmarks.`}
        value={data.roadmap.most_active_roadmap.title}
        className='from-purple-300/40 to-card dark:bg-card bg-gradient-to-t shadow-xs'
      />
    </div>
  );
}

function StatisticsCard(
  props: {
    title: string;
    description: React.ReactNode;
    value: React.ReactNode;
  } & React.ComponentProps<"div">
) {
  return (
    <Card className={cn(props.className, "@container/card")} {...props}>
      <CardHeader>
        <CardDescription>{props.title}</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {props.value}
        </CardTitle>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          {props.description}
        </div>
      </CardFooter>
    </Card>
  );
}

function StatisticsCardLink(
  props: {
    title: string;
    description: React.ReactNode;
    value: React.ReactNode;
    href: string;
  } & React.ComponentProps<"div">
) {
  return (
    <Link className='@container/card col-span-2' href={props.href}>
      <Card {...props}>
        <CardHeader>
          <CardDescription>{props.title}</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {props.value}
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {props.description}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
