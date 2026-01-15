"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, SlidersHorizontal, ChevronDown, ChevronUp, Plane } from "lucide-react";

interface SearchFormProps {
    onSearch: (criteria: {
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
    }) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
    const [searchMode, setSearchMode] = useState<"route" | "flight">("route");

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [flightCodeInput, setFlightCodeInput] = useState("");

    // Advanced Filters
    const [showFilters, setShowFilters] = useState(false);
    const [maxPrice, setMaxPrice] = useState<number>(2000);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [minDuration, setMinDuration] = useState<number>(0);
    const [maxDuration, setMaxDuration] = useState<number>(24);
    const [stops, setStops] = useState("any");
    const [status, setStatus] = useState("");
    const [filterFlightCode, setFilterFlightCode] = useState(""); // For "Route" mode optional filter
    const [sortBy, setSortBy] = useState("price_asc");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchMode === "route") {
            onSearch({
                origin,
                destination,
                date,
                maxPrice: showFilters ? maxPrice : undefined,
                minPrice: showFilters ? minPrice : undefined,
                stops: showFilters ? stops : undefined,
                status: showFilters ? status : undefined,
                minDuration: showFilters ? minDuration * 60 : undefined, // Convert hours to minutes
                maxDuration: showFilters ? maxDuration * 60 : undefined,
                flightCode: showFilters ? filterFlightCode : undefined,
                sortBy: showFilters ? sortBy : undefined
            });
        } else {
            // Flight Code Mode
            onSearch({
                origin: "",
                destination: "",
                date,
                flightCode: flightCodeInput,
                // We don't filter by other advanced filters when searching by specific code
                sortBy: undefined
            });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 justify-center md:justify-start">
                <button
                    type="button"
                    onClick={() => setSearchMode("route")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${searchMode === "route" ? "bg-white text-blue-600 shadow-lg" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
                >
                    Search by Route
                </button>
                <button
                    type="button"
                    onClick={() => setSearchMode("flight")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${searchMode === "flight" ? "bg-white text-blue-600 shadow-lg" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
                >
                    Search by Flight No.
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col gap-4 w-full"
            >
                <div className="flex flex-col md:flex-row gap-4">

                    {searchMode === "route" ? (
                        <>
                            <div className="flex-1 relative group">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">
                                    From
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Origin (e.g., JFK)"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 relative group">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">
                                    To
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Destination (e.g., LHR)"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-[2] relative group">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">
                                Flight Number
                            </label>
                            <div className="relative">
                                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="e.g. SH101, OA815"
                                    value={flightCodeInput}
                                    onChange={(e) => setFlightCodeInput(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 relative group">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">
                            Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Toggle - Only show in Route Mode */}
                {searchMode === "route" && (
                    <div className="border-t border-gray-200/50 pt-2 transition-all">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Advanced Filters
                            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                                {/* Price Range */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400">Min ($)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400">Max ($)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                                placeholder="2000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Duration Range */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration (Hrs)</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={minDuration}
                                                onChange={(e) => setMinDuration(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400">Max</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={maxDuration}
                                                onChange={(e) => setMaxDuration(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                                placeholder="24"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Flight Code Filter in Route Mode */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Airline / Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SkyHigh"
                                        value={filterFlightCode}
                                        onChange={(e) => setFilterFlightCode(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                    />
                                </div>

                                {/* Stops */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stops</label>
                                    <select
                                        value={stops}
                                        onChange={(e) => setStops(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none"
                                    >
                                        <option value="any">Any Stops</option>
                                        <option value="non-stop">Non-stop</option>
                                        <option value="1+">1+ Stops</option>
                                    </select>
                                </div>


                                {/* Sort By */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none"
                                    >
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="duration_asc">Duration: Shortest</option>
                                        <option value="departure_asc">Departure: Earliest</option>
                                    </select>
                                </div>
                                {/* Status */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none"
                                    >
                                        <option value="">Any Status</option>
                                        <option value="active">Active</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="landed">Landed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="incident">Incident</option>
                                        <option value="diverted">Diverted</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
