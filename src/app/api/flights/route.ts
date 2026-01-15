import { NextRequest, NextResponse } from "next/server";
import { FlightServiceFactory } from "@/lib/api/flightService";
import { FlightSearchCriteria } from "@/lib/types";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const criteria: FlightSearchCriteria = {
        origin: searchParams.get("origin") || undefined,
        destination: searchParams.get("destination") || undefined,
        date: searchParams.get("date") || undefined,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        stops: searchParams.get("stops") || undefined,
        flightCode: searchParams.get("flightCode") || undefined,
        sortBy: searchParams.get("sortBy") || undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    };

    try {
        const service = FlightServiceFactory.getService();
        const result = await service.searchFlights(criteria);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Flight search error:", error);
        return NextResponse.json(
            { error: "Failed to fetch flights" },
            { status: 500 }
        );
    }
}
