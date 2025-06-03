"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { deleteRoadmap } from "@/app/dashboard/roadmap/[id]/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { GetRoadmapOutput } from "@/types/api-admin";
import { IconLoader } from "@tabler/icons-react";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

type RoadmapInformationProps = {
  roadmap: GetRoadmapOutput;
};

export function RoadmapInformation({ roadmap }: RoadmapInformationProps) {
  const [isDeleteRoadmapPending, startDeleteRoadmapTransition] =
    React.useTransition();

  const handleDeleteRoadmap = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    startDeleteRoadmapTransition(() => {
      toast.promise(deleteRoadmap(roadmap.id), {
        loading: `Deleting ${roadmap.title}`,
        success: `Roadmap ${roadmap.title} deleted successfully`,
        error: `Failed to delete user ${roadmap.title}`,
      });
    });

    redirect("/dashboard/roadmap");
  };

  return (
    <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
      <h1 className='text-2xl font-semibold'>{roadmap.title}</h1>
      <h4 className='text-lg text-muted-foreground'>Roadmap Information</h4>
      <Separator />
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 py-2 gap-y-6 md:gap-y-12 gap-x-6 md:gap-x-12 lg:gap-x-32 xl:gap-x-52'>
          <div className='flex flex-col gap-6'>
            <h1 className='text-lg font-semibold'>Details</h1>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Title</span>
              </Label>
              <Input
                value={roadmap.title}
                readOnly
                className='w-full col-span-2'
              />
            </div>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Description</span>
              </Label>
              <Textarea
                value={roadmap.description}
                readOnly
                className='w-full col-span-2'
              />
            </div>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Topics</span>
              </Label>
              <Button variant='outline'>{roadmap.total_topics} Topics</Button>
            </div>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Created At</span>
              </Label>
              <Input
                value={dayjs(roadmap.created_at).format("DD/MM/YYYY HH:mm:ss")}
                readOnly
                className='w-full col-span-2'
              />
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <h1 className='text-lg font-semibold'>Personalization Options</h1>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Time Availability</span>
              </Label>
              <Button variant='outline'>
                {roadmap.personalization_options.daily_time_availability.value}{" "}
                {roadmap.personalization_options.daily_time_availability.unit} /
                day
              </Button>
            </div>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Skill Level</span>
              </Label>
              {roadmap.personalization_options.skill_level === "beginner" ? (
                <Button variant='default' className='bg-green-500 text-accent'>
                  Beginner
                </Button>
              ) : roadmap.personalization_options.skill_level ===
                "intermediate" ? (
                <Button variant='default' className='bg-blue-500 text-accent'>
                  Intermediate
                </Button>
              ) : (
                <Button variant='default' className='bg-red-500 text-accent'>
                  Advanced
                </Button>
              )}
            </div>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Duration</span>
              </Label>
              <Button variant='outline'>
                {roadmap.personalization_options.total_duration.value}{" "}
                {roadmap.personalization_options.total_duration.unit}
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <h1 className='text-lg font-semibold'>Creator</h1>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Name</span>
              </Label>
              <Input
                value={roadmap.creator.name}
                readOnly
                className='w-full col-span-2'
              />
            </div>
            <div className='grid md:grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Email</span>
              </Label>
              <Input
                value={roadmap.creator.email}
                readOnly
                className='w-full col-span-2'
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        variant='destructive'
        className='w-32'
        onClick={handleDeleteRoadmap}
      >
        {isDeleteRoadmapPending && (
          <IconLoader className='size-6 animate-spin' />
        )}
        {!isDeleteRoadmapPending && "Delete Roadmap"}
      </Button>
    </div>
  );
}
