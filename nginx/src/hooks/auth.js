import { useState, useEffect, use } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const [auth, setAuth] = useState({ token: null, user: null });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                const userData = {
                    id: decodedToken.id,
                    username: decodedToken.sub,
                    role: decodedToken.role
                };
                setAuth({ token, user: userData });
            } catch (error) {
                console.error("Token invalid, delogare...");
                localStorage.removeItem('token');
                setAuth({ token: null, user: null });
            }
        }
    }, []);
    return auth;
};

export default useAuth;
