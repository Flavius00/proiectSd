import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';
import logoIcon from '../commons/images/icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    const authPaths = ['/login', '/register'];
    const isAuthPage = authPaths.includes(location.pathname);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.sub);
            } catch (error) {
                console.error("Token invalid:", error);
                handleLogout();
            }
        } else {
            setUsername(null);
        }
    }, [token, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="main-navbar">

            <div className="nav-left">
                <Link to="/" className="nav-logo">
                    <img src={logoIcon} alt="Logo" width="25" height="25" />
                </Link>

                {token && !isAuthPage && (
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/user" className="nav-link">
                                Users
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/devices" className="nav-link">
                                Devices
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/chart" className="nav-link">
                                Monitoring
                            </Link>
                        </li>
                    </ul>
                )}
            </div>

            {!isAuthPage && (
                <div className="nav-auth">
                    {token ? (
                        <>
                            <span className="nav-username">
                                {username}
                            </span>
                            <button onClick={handleLogout} className="nav-logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
