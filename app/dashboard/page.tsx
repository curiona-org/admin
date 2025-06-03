import { Statistics } from "@/components/statistics";
import { DataTable } from "@/components/tables/accounts-data-table";

import { Filters } from "@/lib/services/api.service";
import { getStatistics, listUsers } from "./actions";

export default async function Page() {
  const statistics = await getStatistics();

  const filter: Filters = {
    page: 1,
    limit: 10,
  };

  const users = await listUsers(filter);

  const pagination = {
    ...filter,
    total: users.data.total,
    total_pages: users.data.total_pages,
    current_page: users.data.current_page,
  };

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <Statistics data={statistics.data} />
      <DataTable data={users.data.items} paginationOptions={pagination} />
    </div>
  );
}
