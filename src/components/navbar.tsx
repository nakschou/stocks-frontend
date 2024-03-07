'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const router = useRouter();
  const [companyNameOrTicker, setCompanyNameOrTicker] = useState("");

  // handler for form submission
  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://tensorwave-backend.onrender.com/get_stock_ticker?query=${companyNameOrTicker}`);
      const data = await response.json();
      if (data.ticker === undefined) {
        throw new Error("Ticker not found");
      }
      const ticker = data.ticker;
      router.push(`/stock-details/${ticker}`);
    } catch (error) {
      console.error("Failed to fetch ticker:", error);
      router.push("/stock-details/invalid-search");
    }
  };

  return (
    <div className="flex w-full items-center px-4 h-16 md:px-6">
      <Link
        className="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-lg font-medium dark:bg-gray-800"
        href="/"
      >
        <HomeIcon className="h-6 w-6" />
      </Link>
      <form className="flex flex-1 ml-4" onSubmit={handleSearch}>
        <div className="flex w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <Input
            className="w-full h-full text-base font-normal bg-transparent appearance-none focus:outline-none focus:ring-0"
            placeholder="Company Name or Ticker Here"
            type="search"
            value={companyNameOrTicker}
            onChange={(e) => setCompanyNameOrTicker(e.target.value)} // Update state on input change
          />
          <Button className="mr-2" type="submit" variant="icon">
            <SearchIcon className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
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


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
