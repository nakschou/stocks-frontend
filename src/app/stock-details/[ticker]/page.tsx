import { CompanyOverview } from "@/components/company-overview";
import HistoricalData from "@/components/historical-data";
import NavBar from "@/components/navbar";

export default function TickerDetails( { params } ) {

    return (
      <div className="w-full">
          <NavBar />
          <CompanyOverview params={params}/>
          <HistoricalData params={params}/>  
      </div>
    );
  }