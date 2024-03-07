'use client'

import React from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation";


export function CompanyOverview( { params } ) {
    const router = useRouter();
    const [data, setData] = React.useState(null); // Use the interface
    const [isLoading, setIsLoading] =  React.useState(true);
    const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${params.ticker}&apikey=${ALPHAVANTAGE_API_KEY}`
    // const url = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo"

    // effect for fetching data
    React.useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if(data === undefined || data["Information"]) {
                throw new Error('Data is undefined');
            }
            setData(data);
            setIsLoading(false);
          } catch (error) {
            router.push("/stock-details/invalid-search");
          }
        };
    
        fetchData();
      }, [params.ticker]);

      console.log(data);

      const convert_to_illions = (value) => {
        if (value >= 1000000000000) {
            return (value/1000000000000).toFixed(2).replace(/\.0+$/,"") + 'T';
        } else if (value >= 1000000000) {
            return (value/1000000000).toFixed(2).replace(/\.0+$/,"") + 'B';
        } else if (value >= 1000000) {
            return (value/1000000).toFixed(2).replace(/\.0+$/,"") + 'M';
        } else if (value >= 1000) {
            return (value/1000).toFixed(2).replace(/\.0+$/,"") + 'K';
        } else {
            return value;
        }
    }
    //loading screen
    if (isLoading) {
        return (
            <Card className="w-full max-w">
            <CardHeader className="pb-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-full" />
            </CardHeader>
            <CardContent className="grid gap-4">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="border-t border-b py-2">
                <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1">
                        <HomeIcon className="w-4 h-4" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="flex items-center gap-1">
                        <GlobeIcon className="w-4 h-4" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="flex items-center gap-1">
                        <ActivityIcon className="w-4 h-4" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="flex items-center gap-1">
                        <DollarSignIcon className="w-4 h-4" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        )

    } else {
        return (
            <Card className="w-full max-w">
            <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold leading-none">{data?.Symbol ?? 'N/A'}</CardTitle>
                <CardDescription className="text-sm font-medium">{data?.AssetType ?? 'N/A'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <p className="text-sm font-medium">{data?.Name ?? 'N/A'}</p>
                <p className="text-xs">{data?.Description ?? 'N/A'}</p>
                <div className="border-t border-b py-2">
                <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1">
                    <HomeIcon className="w-4 h-4" />
                    <span>{data?.Country ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <GlobeIcon className="w-4 h-4" />
                    <span>{
                      data?.Sector
                        ? data.Sector.replace(/\w\S*/g, function(txt){
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                          })
                        : 'N/A'
                    }</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <ActivityIcon className="w-4 h-4" />
                    <span>{
                      data?.Industry
                        ? data.Industry.replace(/\w\S*/g, function(txt){
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                          })
                        : 'N/A'
                    }</span>                    </div>
                    <div className="flex items-center gap-1">
                    <DollarSignIcon className="w-4 h-4" />
                    <span>{convert_to_illions(data?.MarketCapitalization) ?? 'N/A'}</span>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        );
    }
  }

  function ActivityIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  }
  
  
  function DollarSignIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  }
  
  
  function GlobeIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  }
  
  
  function HomeIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  }