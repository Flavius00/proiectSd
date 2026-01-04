import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

import * as API_MONITORING from "./api/monitoring-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import useAuth from "../hooks/auth";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EnergyChart() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chartsData, setChartsData] = useState([]); // Vom stoca un array de obiecte gata de afișat
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            fetchData(user.id);
        }
    }, [selectedDate, user]);

    const fetchData = (userId) => {
        setError({ status: 0, errorMessage: null });
        const dateStr = selectedDate.toISOString().split('T')[0];

        // Facem UN SINGUR APEL către Monitoring Service
        API_MONITORING.getEnergyConsumptionByUser({ userId: userId, date: dateStr }, (result, status, err) => {
            if (result !== null && status === 200) {
                processChartsData(result);
            } else {
                setError({ status: status, errorMessage: err });
                setChartsData([]);
            }
        });
    };

    const processChartsData = (deviceDataList) => {
        // deviceDataList este: [{ deviceId, name, maximumConsumption, readings: [...] }, ...]

        const fullDayLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

        const processedData = deviceDataList.map(deviceInfo => {
            // 1. Procesăm citirile (Bara albastră)
            const hourlyValues = new Array(24).fill(0);
            deviceInfo.readings.forEach(r => {
                const hour = new Date(r.timeStamp).getHours();
                if (hour >= 0 && hour < 24) hourlyValues[hour] = r.reading;
            });

            // 2. Procesăm limita (Linia roșie)
            const maxLimitValues = new Array(24).fill(deviceInfo.maximumConsumption);

            return {
                id: deviceInfo.deviceId,
                name: deviceInfo.name, // Numele vine direct din backend
                chartData: {
                    labels: fullDayLabels,
                    datasets: [
                        {
                            label: 'Consum (kWh)',
                            data: hourlyValues,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.2,
                            order: 1
                        },
                        {
                            label: `Limită (${deviceInfo.maximumConsumption} kWh)`,
                            data: maxLimitValues,
                            borderColor: 'red',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointRadius: 0,
                            order: 0
                        }
                    ]
                }
            };
        });

        setChartsData(processedData);
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Dashboard Consum Energie</h1>

            <Row className="mb-4 justify-content-center">
                <Col md={4} className="text-center">
                    <label className="mr-2 font-weight-bold">Data: </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="form-control text-center"
                    />
                </Col>
            </Row>

            {error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
            }

            <Row>
                {chartsData.map(device => (
                    <Col md={6} lg={6} sm={12} key={device.id} className="mb-4">
                        <Card className="shadow-sm">
                            <CardBody>
                                <CardTitle tag="h5" className="text-center mb-3">
                                    {device.name}
                                </CardTitle>

                                <div style={{ height: '300px' }}>
                                    <Line
                                        data={device.chartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: { y: { beginAtZero: true } },
                                            plugins: { legend: { position: 'top' } }
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}

                {chartsData.length === 0 && !error.errorMessage && (
                    <p className="text-center">Nu există date sau dispozitive pentru această zi.</p>
                )}
            </Row>
        </Container>
    );
}

export default EnergyChart;
