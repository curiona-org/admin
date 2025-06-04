import { RoadmapInformation } from "@/components/roadmap-information";
import { RoadmapInformationTopics } from "@/components/roadmap-information-topics";
import { DataTable } from "@/components/tables/roadmap-information-ratings-data-table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filters } from "@/lib/services/api.service";
import { getRoadmap, listRoadmapRatings } from "./actions";

export default async function RoadmapDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const { data: roadmap } = await getRoadmap(Number(id));

  const ratingFilter: Filters = {
    page: 1,
    limit: 10,
  };

  const ratings = await listRoadmapRatings(Number(id), ratingFilter);

  const pagination = {
    ...ratingFilter,
    total: ratings.data.total,
    total_pages: ratings.data.total_pages,
    current_page: ratings.data.current_page,
  };

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='w-full flex-col justify-start gap-6'>
        <RoadmapInformation roadmap={roadmap} />
        <Separator className='my-6' />
        <Tabs
          defaultValue='topics'
          className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'
        >
          <TabsList>
            <TabsTrigger value='topics'>Topics</TabsTrigger>
            <TabsTrigger value='ratings'>Ratings</TabsTrigger>
          </TabsList>
          <TabsContent value='topics'>
            <RoadmapInformationTopics topics={roadmap.topics} />
          </TabsContent>
          <TabsContent value='ratings'>
            <DataTable
              title='Ratings'
              roadmapId={Number(id)}
              data={ratings.data.items}
              paginationOptions={pagination}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
