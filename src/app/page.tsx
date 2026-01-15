"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { mockFlights, Flight } from "@/lib/mockData";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";
import FlightDetails from "@/components/FlightDetails";
import Pagination from "@/components/Pagination";


export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  // Keep track of current search criteria
  const [currentCriteria, setCurrentCriteria] = useState<{
    origin: string;
    destination: string;
    date: string;
    maxPrice?: number;
    minPrice?: number;
    stops?: string;
    status?: string;
    minDuration?: number;
    maxDuration?: number;
    flightCode?: string;
    sortBy?: string;
  }>({
    origin: "",
    destination: "",
    date: "",
  });

  const fetchFlights = async (criteria: any, page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...criteria,
        page: page.toString(),
        limit: '10'
      });

      // Clean up undefined/empty params
      for (const [key, value] of Array.from(params.entries())) {
        if (!value || value === 'undefined') params.delete(key);
      }

      const res = await fetch(`/api/flights?${params.toString()}`);
      const data = await res.json();

      if (data.data) {
        setFlights(data.data);
        setPagination({
          page: page,
          limit: data.pagination.limit,
          total: data.pagination.total
        });
      } else {
        setFlights([]);
      }
    } catch (error) {
      console.error("Failed to fetch flights:", error);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFlights(currentCriteria);
  }, []);


  const handleSearch = (criteria: typeof currentCriteria) => {
    setCurrentCriteria(criteria);
    fetchFlights(criteria, 1);
  };

  const handlePageChange = (newPage: number) => {
    fetchFlights(currentCriteria, newPage);
  };

  return (
    <main className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)] pb-20">
      {/* Hero Section */}
      <div className="relative bg-blue-900 flex flex-col items-center justify-center overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-800 opacity-90 z-0"></div>
        {/* Abstract shapes/bg */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col gap-8">
          <div className="text-center text-white mb-4">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
              <span className="block">SkyLedger</span>
              <span className="block">Track your next journey</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              SkyLedger provides real-time flight status, detailed schedules, and seamless tracking for travelers worldwide.
            </p>
          </div>

          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {pagination.total > 0 ? `${pagination.total} Flights Found` : 'Start your search'}
              </h2>
              {pagination.total > 0 && <span className="text-sm text-gray-500">Page {pagination.page}</span>}
            </div>

            {flights.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {flights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onClick={setSelectedFlight}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={Math.ceil(pagination.total / pagination.limit)}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                  {currentCriteria.origin || currentCriteria.destination ? 'No flights found matching your criteria.' : 'Enter your trip details above to find flights.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedFlight && (
        <FlightDetails
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </main>
  );
}
