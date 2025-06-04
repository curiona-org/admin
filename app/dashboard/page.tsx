import { Statistics } from "@/components/statistics";

import { getStatistics } from "./actions";

export default async function Page() {
  const statistics = await getStatistics();

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <Statistics data={statistics.data} />
    </div>
  );
}
