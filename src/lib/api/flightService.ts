import { FlightSearchCriteria, FlightSearchResponse } from "../types";
import { AviationStackService } from "./providers/aviationStack";
import { MockFlightService } from "./providers/mockService";

export interface IFlightService {
    searchFlights(criteria: FlightSearchCriteria): Promise<FlightSearchResponse>;
}

export class FlightServiceFactory {
    static getService(): IFlightService {
        const apiKey = process.env.AVIATIONSTACK_API_KEY;

        if (apiKey) {
            return new AviationStackService(apiKey);
        }

        return new MockFlightService();
    }
}
