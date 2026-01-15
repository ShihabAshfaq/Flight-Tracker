import { IFlightService } from "../flightService";
import { FlightSearchCriteria, FlightSearchResponse, Flight } from "../../types";

export class AviationStackService implements IFlightService {
    private apiKey: string;
    private baseUrl = 'http://api.aviationstack.com/v1';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async searchFlights(criteria: FlightSearchCriteria): Promise<FlightSearchResponse> {
        const params = new URLSearchParams({
            access_key: this.apiKey,
            limit: (criteria.limit || 10).toString(),
            offset: (((criteria.page || 1) - 1) * (criteria.limit || 10)).toString(),
        });

        // Aviationstack filters
        if (criteria.flightCode) {
            // Simple heuristic: if 2 letters + numbers, assume IATA flight number
            // API has flight_iata or airline_name. 
            // We will try to filter by flight_iata if it looks like one.
            params.append('flight_iata', criteria.flightCode);
        }

        // Note: Aviationstack free tier has limited filtering capabilities (e.g. by origin/destination might require IATA codes)
        // The user input might be city names. 
        // Ideally we'd need an autocomplete for airports. 
        // For this implementation, we will fetch active flights and filter client-side (or here in service) 
        // if the API doesn't support loose string matching on city names safely.
        // However, the task requires "real data". 
        // Let's rely on 'dep_iata' or 'arr_iata' if user provides 3 chars, or just fetch 'active' flights.
        // Given the constraints, let's try to map criteria to params best effort.

        if (criteria.origin && criteria.origin.length === 3) {
            params.append('dep_iata', criteria.origin.toUpperCase());
        }
        if (criteria.destination && criteria.destination.length === 3) {
            params.append('arr_iata', criteria.destination.toUpperCase());
        }

        // Default to 'active' flights if no specific search to ensure we get something interesting
        // Or just '/flights' endpoint.
        // User request: Prioritize Australian flights (inbound/outbound)
        // Default to 'active' flights if no specific search to ensure we get something interesting
        // User request: Prioritize Australian flights (inbound/outbound)
        if (!criteria.origin && !criteria.destination && !criteria.flightCode && !criteria.status) {
            // "Healthy mix" strategy:
            // Fetch 5 departures from SYD and 5 arrivals to SYD to ensure inbound/outbound variety
            // This logic replaces the single fetch

            const depParams = new URLSearchParams(params);
            depParams.set('dep_iata', 'SYD');
            depParams.set('limit', '5'); // Half page

            const arrParams = new URLSearchParams(params);
            arrParams.set('arr_iata', 'SYD');
            arrParams.set('limit', '5'); // Half page

            try {
                const [depRes, arrRes] = await Promise.all([
                    fetch(`${this.baseUrl}/flights?${depParams.toString()}`),
                    fetch(`${this.baseUrl}/flights?${arrParams.toString()}`)
                ]);

                if (!depRes.ok || !arrRes.ok) throw new Error('One of the API calls failed');

                const depJson = await depRes.json();
                const arrJson = await arrRes.json();

                const depFlights = (depJson.data || []).map((i: any) => this.mapToFlight(i));
                const arrFlights = (arrJson.data || []).map((i: any) => this.mapToFlight(i));

                // Interleave results
                let combined: Flight[] = [];
                const maxLength = Math.max(depFlights.length, arrFlights.length);
                for (let i = 0; i < maxLength; i++) {
                    if (depFlights[i]) combined.push(depFlights[i]);
                    if (arrFlights[i]) combined.push(arrFlights[i]);
                }

                // Apply price simulation to combined results
                combined = combined.map(f => ({
                    ...f,
                    price: this.simulatePrice(f)
                }));

                return {
                    data: combined,
                    pagination: {
                        total: (depJson.pagination?.total || 0) + (arrJson.pagination?.total || 0),
                        offset: parseInt(params.get('offset') || '0'),
                        limit: parseInt(params.get('limit') || '10')
                    }
                };

            } catch (error) {
                // Fallback to simple fetch if parallel fails
                console.error("Parallel fetch failed, falling back to simple SYD dep", error);
                params.append('dep_iata', 'SYD');
            }
        } else {
            // Normal search flow checks
            if (criteria.status) {
                params.append('flight_status', criteria.status);
            }
        }

        const response = await fetch(`${this.baseUrl}/flights?${params.toString()}`);


        if (!response.ok) {
            throw new Error(`Aviationstack API error: ${response.statusText}`);
        }

        const json = await response.json();

        if (json.error) {
            // Fallback or throw? Let's throw to be handled by caller
            throw new Error(`Aviationstack API error: ${json.error.info || 'Unknown error'}`);
        }

        const { data, pagination } = json;

        const mappedFlights: Flight[] = data.map((item: any) => this.mapToFlight(item));

        // Post-fetch filtering for things API might have missed or for complex text matching NOT supported by free tier basics
        let filtered = mappedFlights;
        if (criteria.origin && criteria.origin.length !== 3) {
            filtered = filtered.filter(f => f.origin.toLowerCase().includes(criteria.origin!.toLowerCase()));
        }
        if (criteria.destination && criteria.destination.length !== 3) {
            filtered = filtered.filter(f => f.destination.toLowerCase().includes(criteria.destination!.toLowerCase()));
        }

        // Price simulation (since API doesn't provide it)
        filtered = filtered.map(f => ({
            ...f,
            price: this.simulatePrice(f)
        }));

        // Client-side Price & Stops & Duration filtering
        if (criteria.maxPrice) {
            filtered = filtered.filter(f => f.price <= criteria.maxPrice!);
        }
        if (criteria.minPrice) {
            filtered = filtered.filter(f => f.price >= criteria.minPrice!);
        }
        if (criteria.stops) {
            if (criteria.stops === "non-stop") filtered = filtered.filter(f => f.stops === 0);
            if (criteria.stops === "1+") filtered = filtered.filter(f => f.stops >= 1);
        }

        // Duration filtering
        if (criteria.minDuration || criteria.maxDuration) {
            filtered = filtered.filter(f => {
                const minutes = this.parseDurationToMinutes(f.duration);
                const minOk = criteria.minDuration ? minutes >= criteria.minDuration : true;
                const maxOk = criteria.maxDuration ? minutes <= criteria.maxDuration : true;
                return minOk && maxOk;
            });
        }

        return {
            data: filtered,
            pagination: {
                total: pagination.total || 0,
                offset: pagination.offset || 0,
                limit: pagination.limit || 10
            }
        };
    }

    private mapToFlight(item: any): Flight {
        // Helper to calculate simple duration if not provided
        // item.departure.scheduled vs item.arrival.scheduled
        const dep = new Date(item.departure.scheduled);
        const arr = new Date(item.arrival.scheduled);
        const durationMs = arr.getTime() - dep.getTime();
        const durationMinutes = Math.floor(durationMs / 60000);
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        const durationStr = `${hours}h ${minutes}m`;

        return {
            id: `${item.flight.iata || 'UK'}-${item.flight_date}`,
            flightNumber: item.flight.iata || item.flight.number || 'Unknown',
            airline: item.airline.name || 'Unknown Airline',
            aircraft: item.aircraft?.iata || 'Boeing 737', // Fallback as API often locks aircraft data behind tier
            origin: item.departure.iata || item.departure.airport || 'Unknown',
            destination: item.arrival.iata || item.arrival.airport || 'Unknown',
            departureTime: item.departure.scheduled,
            arrivalTime: item.arrival.scheduled,
            status: item.flight_status,
            gate: item.departure.gate,
            terminal: item.departure.terminal,
            duration: durationStr,
            price: 0, // Set later
            stops: 0, // Most live flights are direct in this feed usually, assuming 0 for now unless flight has legs
            // Attempt to derive city from timezone or airport name as fallback
            originCity: this.formatCity(item.departure.timezone, item.departure.iata) || item.departure.airport || 'Unknown',
            destinationCity: this.formatCity(item.arrival.timezone, item.arrival.iata) || item.arrival.airport || 'Unknown'
        };
    }

    private formatCity(timezone: string, iata: string): string | null {
        if (!timezone) return null;

        // Manual override for known timezone collisions or helpful defaults
        const cityOverrides: Record<string, string> = {
            'CBR': 'Canberra',
            'OOL': 'Gold Coast',
            'HBA': 'Hobart',
            'LST': 'Launceston',
            'NTL': 'Newcastle',
            'AVV': 'Avalon',
            'CHC': 'Christchurch',
            'WOL': 'Wollongong',
            'MCY': 'Sunshine Coast',
            'TSV': 'Townsville',
            'CNS': 'Cairns',
            'DRW': 'Darwin',
            'ASP': 'Alice Springs',
            'BNE': 'Brisbane',
            'MEL': 'Melbourne',
            'SYD': 'Sydney',
            'ADL': 'Adelaide',
            'PER': 'Perth',
            'AKL': 'Auckland',
            'WLG': 'Wellington',
            'ZQN': 'Queenstown'
        };

        if (cityOverrides[iata]) {
            return cityOverrides[iata];
        }

        // Timezone format usually "Australia/Sydney" -> "Sydney"
        const parts = timezone.split('/');
        if (parts.length > 1) {
            return parts[parts.length - 1].replace(/_/g, ' ');
        }
        return null;
    }

    private simulatePrice(flight: Flight): number {
        // Simple algorithm: base price + (duration hours * 50)
        // Add some randomness based on flight number hash to keep it consistent for same flight
        const base = 100;
        const parts = flight.duration.split(' ');
        let hours = 0;
        if (parts[0].includes('h')) hours = parseInt(parts[0]);

        let price = base + (hours * 50);

        // Deterministic random
        const hash = flight.flightNumber.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        price += (hash % 100);
        return price;
    }

    private parseDurationToMinutes(durationStr: string): number {
        // Format "1h 30m" or "45m"
        const parts = durationStr.split(' ');
        let total = 0;
        for (const p of parts) {
            if (p.includes('h')) total += parseInt(p) * 60;
            if (p.includes('m')) total += parseInt(p);
        }
        return total;
    }
}


