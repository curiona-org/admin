import { DataTable } from "@/components/tables/user-roadmaps-data-table";

import { Filters } from "@/lib/services/api.service";
import { getUser } from "./actions";

import { AccountInformation } from "@/components/account-information";

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

  const { data: user } = await getUser(Number(id), filter);
  const userRoadmaps = user.roadmaps;

  const pagination = {
    ...filter,
    total: userRoadmaps.total,
    total_pages: userRoadmaps.total_pages,
    current_page: userRoadmaps.current_page,
  };

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='w-full flex-col justify-start gap-6'>
        <AccountInformation user={user} />
        <DataTable
          userId={user.id}
          title='Roadmaps Generated'
          data={userRoadmaps.items}
          paginationOptions={pagination}
        />
      </div>
    </div>
  );
}
