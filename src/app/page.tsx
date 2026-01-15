"use client";

import { useState } from "react";
import Image from "next/image";
import { mockFlights, Flight } from "@/lib/mockData";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";
import FlightDetails from "@/components/FlightDetails";

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (criteria: {
    origin: string;
    destination: string;
    date: string;
    maxPrice?: number;
    stops?: string;
    flightCode?: string;
    sortBy?: string;
  }) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = mockFlights.filter((flight) => {
        const matchesOrigin = criteria.origin === "" || flight.origin.toLowerCase().includes(criteria.origin.toLowerCase());
        const matchesDest = criteria.destination === "" || flight.destination.toLowerCase().includes(criteria.destination.toLowerCase());

        let matchesPrice = true;
        if (criteria.maxPrice) {
          matchesPrice = flight.price <= criteria.maxPrice;
        }

        let matchesStops = true;
        if (criteria.stops === "non-stop") {
          matchesStops = flight.stops === 0;
        } else if (criteria.stops === "1+") {
          matchesStops = flight.stops >= 1;
        }

        let matchesFlightCode = true;
        if (criteria.flightCode) {
          matchesFlightCode = flight.flightNumber.toLowerCase().includes(criteria.flightCode.toLowerCase()) ||
            flight.airline.toLowerCase().includes(criteria.flightCode.toLowerCase());
        }

        // Date matching omitted for simplicity in this mock, but could be added
        return matchesOrigin && matchesDest && matchesPrice && matchesStops && matchesFlightCode;
      });

      if (criteria.sortBy) {
        filtered = filtered.sort((a, b) => {
          if (criteria.sortBy === "price_asc") return a.price - b.price;
          if (criteria.sortBy === "departure_asc") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
          if (criteria.sortBy === "duration_asc") {
            // Simple parsing for duration like "1h 30m" -> minutes
            const getMinutes = (d: string) => {
              const parts = d.split(' ');
              let total = 0;
              parts.forEach(p => {
                if (p.includes('h')) total += parseInt(p) * 60;
                if (p.includes('m')) total += parseInt(p);
              });
              return total;
            };
            return getMinutes(a.duration) - getMinutes(b.duration);
          }
          return 0;
        });
      }

      setFlights(filtered);
      setIsSearching(false);
    }, 600);
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
              Track your next journey
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Real-time flight status, detailed schedules, and seamless tracking for travelers worldwide.
            </p>
          </div>

          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        {isSearching ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'} Found
              </h2>
              <span className="text-sm text-gray-500">Showing details for today</span>
            </div>

            {flights.length > 0 ? (
              flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onClick={setSelectedFlight}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No flights found matching your criteria.</p>
                <button
                  onClick={() => setFlights(mockFlights)}
                  className="mt-4 text-blue-600 font-semibold hover:underline"
                >
                  View all flights
                </button>
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
