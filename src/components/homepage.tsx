'use client'
import { StockCarousel } from "./stock-carousel"
import * as React from "react"

export default function HomePage() {
  const [trending, setTrending] = React.useState(null); // Use the interface
  const [otherTop, setOtherTop] = React.useState(null); // Use the interface
  const [isLoading, setIsLoading] =  React.useState(true);
  const [error, setError] =  React.useState<Error | null>(null);
  const url = 'https://tensorwave-backend.onrender.com/get_trending_stocks'
  React.useEffect(() => {
      const fetchData = async () => {
        try {
          console.log("fetching data")
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTrending(data);
          console.log(data);
          const otherTopNames = ["Microsoft", "Apple", "NVIDIA", "Saudi Aramco", "Amazon",
        "Alphabet", "Meta Platforms (Facebook)", "Berkshire Hathaway", "Eli Lilly",
      "TSMC", "Broadcom", "Visa", "Novo Nordisk", "Tesla", "JPMorgan Chase"]
          const otherTopTickers = ["MSFT", "AAPL", "NVDA", "2222.SR", "AMZN", 
          "GOOGL", "META", "BRK-B", "LLY", "TSM", "AVGO", "V", "NVO", "TSLA", "JPM"]
          
          const allValuesSet = new Set();
          Object.values(data).forEach(allValuesSet.add, allValuesSet);

          let result = {};

          otherTopNames.forEach((name, index) => {
            const ticker = otherTopTickers[index];
            // Check if the ticker is not in the tickerset
            if (!allValuesSet.has(ticker)) {
                // Construct keys dynamically
                const stockKey = `stock${index + 1}`;
                const tickerKey = `ticker${index + 1}`;
                // Add to the result object
                result[stockKey] = name;
                result[tickerKey] = ticker;
            }
        });
          setOtherTop(result);
          console.log(result)
          setIsLoading(false);
        } catch (error) {
          if (error instanceof Error) {
            setError(error);
          }
        }
      };
  
      fetchData();
    }, []);

  return (
    <div className="px-4 md:px-6 py-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Trending Right Now</h2>
        <div className="flex flex-col items-center justify-center text-center w-full">
          <StockCarousel data={trending}/>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Other Top Stocks</h2>
        <div className="flex flex-col items-center justify-center text-center w-full">
          <StockCarousel data={otherTop}/>
        </div>
      </div>
    </div>
  )
}

