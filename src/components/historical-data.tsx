'use client'

import React from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useRouter } from "next/navigation";

export default function HistoricalData({params}) {

    const router = useRouter();
    const [filteredData, setFilteredData] = React.useState(null); // Use the interface
    const [chartData, setChartData] = React.useState(null); // Use the interface
    const [jsonData, setData] = React.useState(null); // Use the interface
    const [isLoading, setIsLoading] =  React.useState(true);
    const [startDate, setStartDate] = React.useState(Date.now()-12096e5);
    const [endDate, setEndDate] = React.useState(Date.now());
    const [error, setError] =  React.useState<Error | null>(null);
    const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${params.ticker}&outputsize=full&apikey=${ALPHAVANTAGE_API_KEY}`
    // const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo"

    React.useEffect(() => {
        const fetchData = async () => {
          try {
            // Ensure the path to the JSON file is correct. Assuming the file is in the public directory
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            if(data === undefined || data["Information"]) {
                throw new Error('Data is undefined');
            }
            setData(data);
          } catch (error) {
            router.push("/stock-details/invalid-search");
          }
        };
      
        fetchData();
      }, [params.ticker]);
      
      // detect changes in startDate and jsonData
      React.useEffect(() => {
        if (!jsonData) return;
      
        const filteredData = Object.entries(jsonData["Time Series (Daily)"]).map(([date, info], index) => ({
          date,
          open: info["1. open"],
          close: info["4. close"],
          high: info["2. high"],
          low: info["3. low"],
          volume: info["5. volume"],
        })).filter(segment => (new Date(segment.date) >= startDate && new Date(segment.date) <= endDate));
      
        // Update your state with the filtered data
        // Assuming you have a state to hold the filtered data for rendering
        setFilteredData(filteredData);
        const chartData = [
            {
                id: "Stock Price",
                data: filteredData.map(({ date, close }) => ({
                    x: date,
                    y: parseFloat(close),
                })),
            },
        ];
        setChartData(chartData);
        setIsLoading(false);
      }, [startDate, endDate, jsonData]);

    if(isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div classname="flex items-center">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-1/2 justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>  
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-1/2 justify-start font-normal",
                        !startDate && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>           
            <div className="grid grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Historical Stock Data</CardTitle>
                        <CardDescription>
                            Table with columns for the date, opening price, closing price, high price, low price, and volume.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-y-auto max-h-[calc(6.66*2.5rem)]">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Open</th>
                                        <th>Close</th>
                                        <th>High</th>
                                        <th>Low</th>
                                        <th>Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.id}</td>
                                            <td>{row.date}</td>
                                            <td>${parseFloat(row.open).toFixed(2)}</td>
                                            <td>${parseFloat(row.close).toFixed(2)}</td>
                                            <td>${parseFloat(row.high).toFixed(2)}</td>
                                            <td>${parseFloat(row.low).toFixed(2)}</td>
                                            <td>{parseInt(row.volume, 10).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Price Over Time</CardTitle>
                        <CardDescription>
                            The stock's price over time. The x-axis represents the date, and the y-axis represents the stock price.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CurvedlineChart data={chartData} className="w-full aspect-[2/1]" />
                    </CardContent>
                </Card>
            </div>
        </div>
        
    );
}

function CurvedlineChart({ data, ...props }) {
    if (!data) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    const ticklength = Math.ceil(data[0].data.length / 10);
    const tickstr = `every ${ticklength} days`;
    return (
        <div {...props}>
            <ResponsiveLine
                data={data}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{
                    type: "time",
                    format: "%Y-%m-%d",
                    useUTC: false,
                    precision: "day",
                }}
                xFormat="time:%Y-%m-%d"
                yScale={{
                    type: "linear",
                    min: 0,
                    max: "auto",
                    stacked: false,
                    reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    format: "%b %d",
                    tickValues: tickstr,
                    legend: "Time",
                    legendOffset: -12,
                }}
                axisLeft={{
                    legend: "Price",
                    legendOffset: -40,
                }}
                curve="monotoneX"
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemBackground: "rgba(0, 0, 0, .03)",
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
}
