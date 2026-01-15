import { IFlightService } from "../flightService";
import { FlightSearchCriteria, FlightSearchResponse, Flight } from "../../types";
import { mockFlights } from "@/lib/mockData";

export class MockFlightService implements IFlightService {
    async searchFlights(criteria: FlightSearchCriteria): Promise<FlightSearchResponse> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        let filtered = mockFlights.map(f => ({
            ...f,
            // Ensure mock data matches the Flight interface (mapping id manually if needed, 
            // though mockData likely has it but let's be safe or just cast it)
            id: f.id.toString(),
            // mockData might allow number id, interface expects string
        })) as unknown as Flight[];
        // Note: In a real refactor we should align mockData.ts type with shared Flight type
        // For now we will rely on runtime compatibility or valid casting if structures match close enough.
        // Let's actually assume mockData matches mostly but we need to ensure Typescript is happy.
        // We will fix mockData.ts separately or just cast here.

        // Actually, let's fix the import. `mockFlights` imports `Flight` type locally in page.tsx usually. 
        // We should probably rely on the shape.

        // Filtering logic (copied from page.tsx)
        filtered = filtered.filter((flight) => {
            const matchesOrigin = !criteria.origin || flight.origin.toLowerCase().includes(criteria.origin.toLowerCase());
            const matchesDest = !criteria.destination || flight.destination.toLowerCase().includes(criteria.destination.toLowerCase());

            let matchesPrice = true;
            if (criteria.maxPrice) matchesPrice = matchesPrice && flight.price <= criteria.maxPrice;
            if (criteria.minPrice) matchesPrice = matchesPrice && flight.price >= criteria.minPrice;

            let matchesDuration = true;
            if (criteria.minDuration || criteria.maxDuration) {
                const minutes = this.parseDuration(flight.duration);
                if (criteria.minDuration) matchesDuration = matchesDuration && minutes >= criteria.minDuration;
                if (criteria.maxDuration) matchesDuration = matchesDuration && minutes <= criteria.maxDuration;
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

            let matchesStatus = true;
            if (criteria.status) {
                const statusMap: Record<string, string> = {
                    'active': 'On Time',
                    'scheduled': 'On Time',
                    'landed': 'On Time',
                    'cancelled': 'Cancelled'
                };
                const target = statusMap[criteria.status.toLowerCase()] || criteria.status;
                matchesStatus = flight.status.toLowerCase().includes(target.toLowerCase());
            }

            return matchesOrigin && matchesDest && matchesPrice && matchesStops && matchesFlightCode && matchesStatus && matchesDuration;
        });

        // Sorting
        if (criteria.sortBy) {
            filtered.sort((a, b) => {
                if (criteria.sortBy === "price_asc") return a.price - b.price;
                if (criteria.sortBy === "departure_asc") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
                if (criteria.sortBy === "duration_asc") {
                    // Re-implement duration parsing or simpler compare if format is standard
                    return this.parseDuration(a.duration) - this.parseDuration(b.duration);
                }
                return 0;
            });
        }

        // Pagination
        const page = criteria.page || 1;
        const limit = criteria.limit || 10;
        const offset = (page - 1) * limit;
        const paginatedData = filtered.slice(offset, offset + limit);

        return {
            data: paginatedData,
            pagination: {
                total: filtered.length,
                offset,
                limit
            }
        };
    }

    private parseDuration(d: string): number {
        const parts = d.split(' ');
        let total = 0;
        parts.forEach(p => {
            if (p.includes('h')) total += parseInt(p) * 60;
            if (p.includes('m')) total += parseInt(p);
        });
        return total;
    }
}
