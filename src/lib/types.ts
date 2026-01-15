export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    gate?: string;
    terminal?: string;
    duration: string;
    price: number; // Simulated or real
    stops: number;
    originCity?: string;
    destinationCity?: string;
    aircraft?: string;
}



export interface FlightSearchCriteria {
    origin?: string;
    destination?: string;
    date?: string;
    maxPrice?: number;
    minPrice?: number;
    stops?: string; // "non-stop", "1+"
    minDuration?: number; // in hours or minutes? Let's assume minutes for filter granularity but UI might use hours. Let's use minutes.
    maxDuration?: number;
    flightCode?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    status?: string; // "active", "scheduled", "landed", "cancelled", etc.
}


export interface FlightSearchResponse {
    data: Flight[];
    pagination: {
        total: number;
        offset: number;
        limit: number;
    };
}
