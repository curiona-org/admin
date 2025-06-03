import { DataTable } from "@/components/tables/roadmaps-data-table";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Filters } from "@/lib/services/api.service";
import { getUser } from "./actions";

export default async function AccountDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  const filter: Filters = {
    page: 1,
    limit: 10,
  };

  const user = await getUser(Number(id), filter);
  const userRoadmaps = user.data.roadmaps;

  const pagination = {
    ...filter,
    total: userRoadmaps.total,
    total_pages: userRoadmaps.total_pages,
    current_page: userRoadmaps.current_page,
  };

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='w-full flex-col justify-start gap-6'>
        <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
          <h1 className='text-2xl font-semibold'>Account Information</h1>
          <div className='flex flex-col gap-2'>
            <Avatar className='size-24'>
              <AvatarImage src={user.data.avatar} />
            </Avatar>
            <p>
              <strong>Name:</strong> {user.data.name}
            </p>
            <p>
              <strong>Email:</strong> {user.data.email}
            </p>
          </div>
        </div>
        <DataTable
          title='Roadmaps Generated'
          data={userRoadmaps.items}
          paginationOptions={pagination}
        />
      </div>
    </div>
  );
}
