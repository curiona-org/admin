"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GetRoadmapOutput } from "@/types/api-admin";
import { Separator } from "./ui/separator";

type RoadmapInformationTopicsProps = {
  topics: GetRoadmapOutput["topics"];
};

export function RoadmapInformationTopics({
  topics,
}: RoadmapInformationTopicsProps) {
  return (
    <>
      <h1 className='text-2xl font-semibold'>Topics</h1>

      <Accordion
        type='single'
        collapsible
        className='w-full'
        defaultValue={topics[0].slug}
      >
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.slug}>
            <AccordionTrigger>
              <div className='flex flex-col gap-4'>
                <h4 className='text-lg font-semibold'>{topic.title}</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              <div className='grid grid-cols-2 gap-12'>
                <div className='flex flex-col gap-1'>
                  <h4 className='text-base font-semibold'>Description</h4>
                  <p className='text-sm'>{topic.description}</p>
                </div>
                <div className='flex flex-col gap-1'>
                  <h4 className='text-base font-semibold'>Pro Tips</h4>
                  <p className='text-sm'>{topic.pro_tips}</p>
                </div>
              </div>
              {topic.subtopics.map((subtopic) => (
                <div key={subtopic.id} className='flex flex-col gap-4 ml-5'>
                  <Separator className='my-2' />
                  <h4 className='text-lg'>{subtopic.title}</h4>
                  <div className='grid grid-cols-2 gap-12'>
                    <div className='flex flex-col gap-1'>
                      <h4 className='text-base'>Description</h4>
                      <p className='text-sm'>{subtopic.description}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <h4 className='text-base'>Pro Tips</h4>
                      <p className='text-sm'>{subtopic.pro_tips}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className='flex flex-col gap-2'></div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
