import { DataTable } from "@/components/tables/roadmaps-data-table";

import { Filters } from "@/lib/services/api.service";
import { listRoadmaps } from "./actions";

export default async function Page() {
  const filter: Filters = {
    page: 1,
    limit: 10,
  };

  const roadmaps = await listRoadmaps(filter);

  const pagination = {
    ...filter,
    total: roadmaps.data.total,
    total_pages: roadmaps.data.total_pages,
    current_page: roadmaps.data.current_page,
  };

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <DataTable
        title='Roadmap List'
        data={roadmaps.data.items}
        paginationOptions={pagination}
      />
    </div>
  );
}
