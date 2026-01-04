import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

// IMPORTURI API
import * as API_MONITORING from "./api/monitoring-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

// IMPORT HOOK AUTH
import useAuth from "../hooks/auth"; // Asigură-te că calea este corectă către fișierul tău

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EnergyChart() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chartsData, setChartsData] = useState({});
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            fetchData(user.id);
        }
    }, [selectedDate, user]);

    const fetchData = (userId) => {
        setError({ status: 0, errorMessage: null });

        const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

        console.log("Fetching data for User ID:", userId, "Date:", dateStr);

        // Apelăm endpoint-ul din Monitoring Service
        API_MONITORING.getEnergyConsumptionByUser({ userId: userId, date: dateStr }, (result, status, err) => {
            if (result !== null && status === 200) {
                processChartsData(result);
            } else {
                setError({ status: status, errorMessage: err });
                setChartsData({}); // Curățăm graficele în caz de eroare
            }
        });
    };

    const processChartsData = (dataMap) => {
        const newChartsData = {};
        const fullDayLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

        Object.keys(dataMap).forEach(deviceId => {
            const readings = dataMap[deviceId];

            const hourlyValues = new Array(24).fill(0);

            readings.forEach(r => {
                const date = new Date(r.timeStamp);
                const hour = date.getHours(); // 0 - 23
                if (hour >= 0 && hour < 24) {
                    hourlyValues[hour] = r.reading;
                }
            });

            newChartsData[deviceId] = {
                labels: fullDayLabels,
                datasets: [
                    {
                        label: 'Energy Consumption (kWh)',
                        data: hourlyValues,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        tension: 0.2, // Linie puțin curbată
                        pointRadius: 3
                    }
                ]
            };
        });

        setChartsData(newChartsData);
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Energy Consumption Dashboard</h1>

            <Row className="mb-4 justify-content-center">
                <Col md={4} className="text-center">
                    <label className="mr-2 font-weight-bold">Select Date: </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="form-control text-center"
                    />
                </Col>
            </Row>

            {/* Afișare Erori */}
            {error.status > 0 &&
                <Row>
                    <Col>
                        <APIResponseErrorMessage
                            errorStatus={error.status}
                            error={error.errorMessage}
                        />
                    </Col>
                </Row>
            }

            {/* Mesaj dacă user-ul nu e încărcat încă */}
            {!user && (
                <p className="text-center text-muted">Loading user data...</p>
            )}

            {/* Mesaj dacă nu există date și user-ul e logat */}
            {user && Object.keys(chartsData).length === 0 && !error.errorMessage && (
                <p className="text-center">No devices or data found for this user.</p>
            )}

            {/* Generare dinamică a graficelor (Grid Layout) */}
            <Row>
                {Object.keys(chartsData).map(deviceId => (
                    <Col md={6} lg={6} sm={12} key={deviceId} className="mb-4">
                        <Card className="shadow-sm">
                            <CardBody>
                                <CardTitle tag="h5" className="text-muted text-center mb-3">
                                    Device ID: <small>{deviceId}</small>
                                </CardTitle>
                                <div style={{ height: '300px' }}>
                                    <Line
                                        data={chartsData[deviceId]}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: { display: true, text: 'kWh' }
                                                },
                                                x: {
                                                    title: { display: true, text: 'Hour' }
                                                }
                                            },
                                            plugins: {
                                                legend: { position: 'top' }
                                            }
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default EnergyChart;
