import { CompanyOverview } from "@/components/company-overview";

export default function TickerDetails( { params } ) {

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CompanyOverview params={params} />
        <h1 className="text-6xl font-bold">{params.ticker}</h1>
      </main>
    );
  }