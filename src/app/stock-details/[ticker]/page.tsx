import { CompanyOverview } from "@/components/company-overview";
import HistoricalData from "@/components/historical-data";

export default function TickerDetails( { params } ) {

    return (
      <div className="w-full">
          <CompanyOverview />
          <HistoricalData />  
      </div>
    );
  }