import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requiredValidator, minLengthValidator } from '../user/components/validators/user-validators';
import * as AUTH_API from "./api/auth-api";
import './styles/auth-form.css'
import './styles/auth.css';

const formRules = {
    username: [
        { rule: requiredValidator, message: 'Username-ul este obligatoriu.' }
    ],
    password: [
        { rule: requiredValidator, message: 'Parola este obligatorie.' }
    ],
};

const emptyState = {
    username: '',
    password: '',
}

function LoginPage() {
    const [formData, setFormData] = useState(emptyState);
    const [errors, setErrors] = useState({});

    const Navigate = useNavigate();

    const validateField = (name, value) => {
        const rules = formRules[name];
        if (!rules) return '';
        for (const item of rules) {
            if (!item.rule(value)) {
                return item.message;
            }
        }
        return '';
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value, }));
        const errorMessage = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage, }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let newErrors = {};
        let isFormValid = true;

        for (const fieldName in formRules) {
            const value = formData[fieldName];
            const errorMessage = validateField(fieldName, value);
            if (errorMessage) {
                newErrors[fieldName] = errorMessage;
                isFormValid = false;
            }
        }
        setErrors(newErrors);

        if (!isFormValid) {
            alert('Te rog corectează erorile din formular.');
            return;
        }

        AUTH_API.login(formData, (result, status, err) => {
            if (result !== null && status === 200) {
                localStorage.setItem('token', result.token);
                Navigate('/', { replace: true });
                console.log(localStorage.getItem('token'));
            } else {
                console.error('Eroare la login:', err);
                alert('Login eșuat. Te rog verifică datele.');
            }
        });
    };

    return (
        <div className="auth-container">
            <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
                <h2 style={{ textAlign: 'center' }}>Login</h2>

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="andrei.ionescu ..."
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? 'invalid-input' : ''}
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Parolă:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'invalid-input' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <button type="submit" className="submit-btn">
                    Intră în cont
                </button>
            </form>

            <div className="auth-link">
                <p>Nu ai cont? <Link to="/register">Înregistrează-te</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
