import React from 'react';
import Navbar from './components/navbar';
import './App.css';
import UserContainer from './user/user-container';
import DeviceContainer from './device/device-container';
import LoginPage from './auth/login';
import RegisterPage from './auth/register';
import Home from './home/home';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>

        <Route path="/"
          element={<Home />} />

        <Route path="/user"
          element={<UserContainer />} />

        <Route path="/devices"
          element={<DeviceContainer />} />

        <Route path="/login"
          element={<LoginPage />} />

        <Route path="/register"
          element={<RegisterPage />} />

      </Routes>
    </div>
  );
}

export default App;
