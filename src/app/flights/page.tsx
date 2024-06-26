"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import FlightIcon from "@mui/icons-material/Flight";

interface Seat {
    modelSeatId: string;
    seatNumber: string;
    seatClass: string;
}

interface Flight {
    flightId: string;
    flightNumber: string;
    flightModelNameKey: string;
    routeId: string;
    originAirportCode: string;
    destinationAirportCode: string;
    seats: Seat[];
}

interface ApiResponse {
    data: Flight[];
    messages: string[];
    returnCode: number;
}

function FlightComponent() {
    const [flights, setFlights] = useState<Flight[]>([]);

    useEffect(() => {
        axios
            .get<ApiResponse>("http://localhost:8080/flight")
            .then((response) => {
                setFlights(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching flights:", error);
            });
    }, []);

    return (
        <div>
            <h1>Flights</h1>
            <ul className="w-screen h-screen">
                {flights.map((flight) => (
                    <li
                        className="bg-slate-500 h-1/6 w-4/5 mt-10 rounded-lg transition-transform transform hover:scale-105 flex items-center mx-auto"
                        key={flight.flightId}
                    >
                        <div className="w-1/5 flex justify-center items-center">
                            <FlightIcon className="text-7xl" />
                        </div>
                        <div className="w-4/5 p-4">
                            <h1 className="text-3xl">
                                Flight Number: {flight.flightNumber}
                            </h1>
                            <h3 className="text-2xl">
                                {flight.flightModelNameKey},{" "}
                            </h3>
                            <h4 className="text-xl">
                                Goes from {flight.originAirportCode} to{" "}
                                {flight.destinationAirportCode}
                            </h4>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FlightComponent;
