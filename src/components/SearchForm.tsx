"use client";

import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";

interface SearchFormProps {
    onSearch: (criteria: { origin: string; destination: string; date: string }) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ origin, destination, date });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto"
        >
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
        </form>
    );
}
