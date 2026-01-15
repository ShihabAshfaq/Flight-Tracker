"use client";

import { Flight } from "@/lib/types";
import { X, Plane, Clock, Calendar, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlightDetailsProps {
    flight: Flight | null;
    onClose: () => void;
}

export default function FlightDetails({ flight, onClose }: FlightDetailsProps) {
    if (!flight) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
                            <Plane className="w-64 h-64" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                {flight.airline}
                            </span>
                            <span className="text-blue-100 text-sm">{flight.flightNumber}</span>
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <h2 className="text-4xl font-bold">{flight.origin.split(" ")[0]}</h2>
                                <div className="text-sm font-medium text-blue-200 mt-1">{flight.originCity}</div>
                                <div className="text-blue-100 mt-1" suppressHydrationWarning>{new Date(flight.departureTime).toLocaleDateString()}</div>
                            </div>
                            <div className="pb-6">
                                <Plane className="w-6 h-6 rotate-90 text-blue-300" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-bold">{flight.destination.split(" ")[0]}</h2>
                                <div className="text-sm font-medium text-blue-200 mt-1">{flight.destinationCity}</div>
                                <div className="text-blue-100 mt-1" suppressHydrationWarning>{new Date(flight.arrivalTime).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {/* Status Bar */}
                        <div className={`flex items-center gap-3 p-4 rounded-xl mb-8 ${flight.status === "On Time" ? "bg-green-50 text-green-800 border border-green-100" :
                            flight.status === "Delayed" ? "bg-yellow-50 text-yellow-800 border border-yellow-100" :
                                "bg-red-50 text-red-800 border border-red-100"
                            }`}>
                            {flight.status === "On Time" && <CheckCircle className="w-5 h-5" />}
                            {flight.status === "Delayed" && <AlertTriangle className="w-5 h-5" />}
                            {flight.status === "Cancelled" && <AlertCircle className="w-5 h-5" />}
                            <div className="flex flex-col">
                                <span className="font-bold">Status: {flight.status}</span>
                                <span className="text-xs opacity-80">This flight is currently {flight.status.toLowerCase()}.</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Departure</label>
                                <div className="text-2xl font-bold text-gray-900 mt-1" suppressHydrationWarning>
                                    {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-sm text-gray-500">{flight.origin}</div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Arrival</label>
                                <div className="text-2xl font-bold text-gray-900 mt-1" suppressHydrationWarning>
                                    {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-sm text-gray-500">{flight.destination}</div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider block mb-2">Duration</label>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    {flight.duration}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider block mb-2">Aircraft</label>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <Plane className="w-4 h-4 text-blue-500" />
                                    {flight.aircraft}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider block mb-2">Stops</label>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <span className="w-4 h-4 flex items-center justify-center font-bold text-blue-500">•</span>
                                    {flight.stops === 0 ? "Non-stop" : flight.stops}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider block mb-2">Price</label>
                                <div className="text-xl font-bold text-blue-600">
                                    ${flight.price}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
                        Flight ID: {flight.id} • Data provided by MockFlight Service
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
