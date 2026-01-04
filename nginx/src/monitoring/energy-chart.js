import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Container, Row, Col, Input } from 'reactstrap';

// IMPORT NOI: API-ul creat și componenta de eroare
import * as API_MONITORING from "./api/monitoring-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EnergyChart() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [deviceId, setDeviceId] = useState("");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    // State pentru gestionarea erorilor
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const fetchData = () => {
        if (!deviceId) return alert("Introdu un Device ID!");

        // Resetam erorile
        setError({ status: 0, errorMessage: null });

        const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

        // Apelam API-ul prin functia externa
        API_MONITORING.getEnergyConsumption({ deviceId: deviceId, date: dateStr }, (result, status, err) => {
            if (result !== null && status === 200) {
                // SUCES: Procesam datele pentru grafic
                const labels = result.map(d => new Date(d.timeStamp).getHours() + ":00");
                const values = result.map(d => d.reading);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Energy Consumption (kWh)',
                            data: values,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        }
                    ]
                });
            } else {
                // EROARE: Setam mesajul de eroare
                setError({ status: status, errorMessage: err });
            }
        });
    };

    return (
        <Container>
            <h1>Energy Consumption Chart</h1>
            <Row className="mb-4">
                <Col>
                    <Input
                        placeholder="Device ID (UUID)"
                        value={deviceId}
                        onChange={e => setDeviceId(e.target.value)}
                    />
                </Col>
                <Col>
                    <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                </Col>
                <Col>
                    <Button color="primary" onClick={fetchData}>Load Chart</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    {/* Afisam eroarea daca exista */}
                    {error.status > 0 &&
                        <APIResponseErrorMessage
                            errorStatus={error.status}
                            error={error.errorMessage}
                        />
                    }

                    <div style={{ height: '400px' }}>
                        {chartData.labels.length > 0 ?
                            <Line data={chartData} /> :
                            <p>No data to display. Enter a Device ID and click Load.</p>
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default EnergyChart;
