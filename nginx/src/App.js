import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Alert } from 'reactstrap';

import NavigationBar from './components/navbar';
import Home from './home/home';
import DeviceContainer from './device/device-container';
import UserContainer from './user/user-container';
import Login from './auth/login';
import Register from './auth/register';
import EnergyChart from './monitoring/energy-chart';

import useAuth from './hooks/auth';
import useWebSocket from './hooks/useWebSockets'; // <--- IMPORT NOU

import './App.css';

function App() {
  const { user } = useAuth(); // Luăm user-ul din token
  const [notifications, setNotifications] = useState([]);

  // Funcția care rulează când vine o notificare
  const handleNotification = (notif) => {
    // Adăugăm notificarea în listă
    const newNotif = { id: Date.now(), ...notif };
    setNotifications(prev => [newNotif, ...prev]);

    // O ștergem automat după 5 secunde (opțional)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  };

  // Activăm WebSocket-ul doar dacă avem un user logat
  useWebSocket(user?.id, handleNotification);

  return (
    <div className="App">
      <div>
        <NavigationBar />

        {/* ZONA DE NOTIFICĂRI (Fixed Top) */}
        <div style={{ position: 'fixed', top: '70px', right: '20px', zIndex: 9999, width: '300px' }}>
          {notifications.map((n) => (
            <Alert key={n.id} color="danger" toggle={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}>
              <strong>Warning!</strong> {n.message}
            </Alert>
          ))}
        </div>

        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/devices" element={<DeviceContainer />} />
            <Route path="/users" element={<UserContainer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chart" element={<EnergyChart />} />
          </Routes>
        </Container>
      </div>
    </div>
  );
}

export default App;
