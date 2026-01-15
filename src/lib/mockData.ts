export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string; // ISO string
    arrivalTime: string; // ISO string
    duration: string;
    price: number;
    stops: number;
    aircraft: string;
    status: 'On Time' | 'Delayed' | 'Cancelled';
    originCity?: string;
    destinationCity?: string;
}

export const mockFlights: Flight[] = [
    {
        id: '1',
        airline: 'SkyHigh Airways',
        flightNumber: 'SH101',
        origin: 'New York (JFK)',
        destination: 'London (LHR)',
        departureTime: '2024-05-20T08:00:00Z',
        arrivalTime: '2024-05-20T20:00:00Z',
        duration: '7h 00m',
        price: 450,
        stops: 0,
        aircraft: 'Boeing 787',
        status: 'On Time',
    },
    {
        id: '2',
        airline: 'Oceanic Airlines',
        flightNumber: 'OA815',
        origin: 'Sydney (SYD)',
        destination: 'Los Angeles (LAX)',
        departureTime: '2024-05-21T14:30:00Z',
        arrivalTime: '2024-05-21T06:00:00Z', // Arrives technically "previous" day local time due to timezone, but simplicity here
        duration: '13h 30m',
        price: 1200,
        stops: 0,
        aircraft: 'Airbus A350',
        status: 'On Time',
    },
    {
        id: '3',
        airline: 'Global Transit',
        flightNumber: 'GT303',
        origin: 'Dubai (DXB)',
        destination: 'Tokyo (HND)',
        departureTime: '2024-05-22T22:00:00Z',
        arrivalTime: '2024-05-23T12:00:00Z',
        duration: '9h 00m',
        price: 800,
        stops: 1,
        aircraft: 'Boeing 777',
        status: 'Delayed',
    },
    {
        id: '4',
        airline: 'EuroWings',
        flightNumber: 'EW456',
        origin: 'Berlin (BER)',
        destination: 'Paris (CDG)',
        departureTime: '2024-05-20T09:00:00Z',
        arrivalTime: '2024-05-20T10:45:00Z',
        duration: '1h 45m',
        price: 120,
        stops: 0,
        aircraft: 'Airbus A320',
        status: 'On Time',
    },
    {
        id: '5',
        airline: 'Liberty Air',
        flightNumber: 'LA789',
        origin: 'San Francisco (SFO)',
        destination: 'New York (JFK)',
        departureTime: '2024-05-21T06:00:00Z',
        arrivalTime: '2024-05-21T14:30:00Z',
        duration: '5h 30m',
        price: 350,
        stops: 0,
        aircraft: 'Boeing 737 MAX',
        status: 'Cancelled',
    },
];
