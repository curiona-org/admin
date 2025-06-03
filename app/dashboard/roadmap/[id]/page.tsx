import { Separator } from "@/components/ui/separator";
import { getRoadmap } from "./actions";

import { RoadmapInformation } from "@/components/roadmap-information";
import { RoadmapInformationTopics } from "@/components/roadmap-information-topics";

export default async function RoadmapDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const { data: roadmap } = await getRoadmap(Number(id));

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='w-full flex-col justify-start gap-6'>
        <RoadmapInformation roadmap={roadmap} />
        <Separator className='my-6' />
        <RoadmapInformationTopics topics={roadmap.topics} />
      </div>
    </div>
  );
}
