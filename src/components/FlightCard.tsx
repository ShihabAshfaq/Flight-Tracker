"use client";

import { Flight } from "@/lib/mockData";
import { Plane, Clock, ArrowRight, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface FlightCardProps {
    flight: Flight;
    onClick: (flight: Flight) => void;
}

export default function FlightCard({ flight, onClick }: FlightCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick(flight)}
            className="bg-white rounded-2xl p-6 mb-4 cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 md:hidden">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
            ${flight.status === "On Time"
                            ? "bg-green-100 text-green-700"
                            : flight.status === "Delayed"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                >
                    {flight.status}
                </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Left: Airline Info */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
                    <p className="text-sm text-gray-500 font-medium">{flight.flightNumber}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md w-fit">
                        <Plane className="w-3 h-3" />
                        {flight.aircraft}
                    </div>
                </div>

                {/* Center: Route & Time */}
                <div className="flex items-center gap-4 flex-1 w-full md:w-auto justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800" suppressHydrationWarning>
                            {new Date(flight.departureTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{flight.origin}</div>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[120px]">
                        <span className="text-xs text-gray-400 mb-1">{flight.duration}</span>
                        <div className="w-full h-[2px] bg-gray-200 relative">
                            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-0">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                {flight.stops > 0 && <div className="w-2 h-2 rounded-full bg-orange-400 border-2 border-white"></div>}
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                            {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
                        </span>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800" suppressHydrationWarning>
                            {new Date(flight.arrivalTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{flight.destination}</div>
                    </div>
                </div>

                {/* Right: Price & Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4">
                    <span
                        className={`hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2
                        ${flight.status === "On Time"
                                ? "bg-green-100 text-green-700"
                                : flight.status === "Delayed"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                    >
                        {flight.status}
                    </span>
                    <div className="text-2xl font-bold text-blue-600 flex items-center">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        {flight.price}
                    </div>
                    <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-semibold group-hover:bg-blue-600 transition-colors flex items-center gap-2">
                        Details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
