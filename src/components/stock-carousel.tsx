import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link';
import { Loader2 } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

export function StockCarousel( { data } ) {

    if (!data) {
        return (
            <Carousel
            opts={{
              align: "start",
            }}
            className="w-4/5 mx-auto"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                      <Card>
                      <CardContent className="p-6 flex flex-col gap-4 items-center">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-2 w-full" />
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                      </CardContent>
                      </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )
    }
    else { 
        const stocks = Object.keys(data).reduce((acc, key, index, array) => {
            if (key.includes("stock")) {
              acc.push({ name: data[key], ticker: data[`ticker${key.match(/\d+/)[0]}`] });
            }
            return acc;
          }, []);
        return (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-4/5 mx-auto"
            >
              <CarouselContent>
                {stocks.map((stock, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                        <Card>
                        <CardContent className="p-6 flex flex-col gap-4 items-center flex-grow">
                            <span className="text-md font-bold">{stock.name}</span>
                            <span className="text-sm text-gray-500">{stock.ticker}</span>
                            <Button asChild>
                                <Link href={`/stock-details/${stock.ticker}`}>View Details</Link>
                            </Button>
                        </CardContent>
                        </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )
    }

}
