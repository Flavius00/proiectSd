import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import { requiredValidator, minLengthValidator, emailValidator } from '../user/components/validators/user-validators';
import * as AUTH_API from "./api/auth-api";
import * as API_USERS from "../user/api/user-api";
import './styles/auth-form.css'
import './styles/auth.css';

const formRules = {
    username: [
        { rule: requiredValidator, message: 'Username-ul este obligatoriu.' },
        { rule: (value) => minLengthValidator(value, 3), message: 'Username-ul trebuie să aibă minim 3 caractere.' }
    ],
    email: [
        { rule: requiredValidator, message: 'Email-ul este obligatoriu.' },
        { rule: emailValidator, message: 'Email-ul nu e valid.' }
    ],
    password: [
        { rule: requiredValidator, message: 'Parola este obligatorie.' },
        { rule: (value) => minLengthValidator(value, 6), message: 'Parola trebuie să aibă minim 6 caractere.' }
    ],
    firstName: [
        { rule: requiredValidator, message: 'Prenumele este obligatoriu.' }
    ],
    lastName: [
        { rule: requiredValidator, message: 'Numele este obligatoriu.' }
    ],
    address: [
        { rule: requiredValidator, message: 'Adresa este obligatorie.' }
    ],
    age: [
        { rule: (value) => parseInt(value, 10) >= 18, message: 'Vârsta minimă este 18 ani.' }
    ],
};

const emptyState = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    age: '',
}

function RegisterPage() {
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

        const authData = {
            username: formData.username,
            password: formData.password,
            email: formData.email
        };

        AUTH_API.register(authData, (result, status, err) => {
            if (status === 201) {
                AUTH_API.login({ username: formData.username, password: formData.password }, (loginResult, loginStatus, loginErr) => {
                    if (loginResult !== null && loginStatus === 200) {
                        localStorage.setItem('token', loginResult.token);
                        const userData = {
                            id: jwtDecode(loginResult.token).id,
                            username: formData.username,
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            address: formData.address,
                            age: formData.age
                        };


                        API_USERS.postUser(userData, (result, status, err) => {
                            if (status === 201) {
                                console.log('Datele utilizatorului au fost salvate cu succes.');
                                Navigate('/', { replace: true });
                            } else {
                                console.error('Eroare la salvarea datelor utilizatorului:', err);
                            }
                        });
                    }
                });
            } else {
                alert('Eroare la crearea contului. Te rog încearcă din nou.');
            }
        });

    };

    return (

        <div className="auth-container">
            <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
                <h2 style={{ textAlign: 'center' }}>Înregistrare cont nou</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" placeholder="andrei.ionescu ..." value={formData.username} onChange={handleChange} className={errors.username ? 'invalid-input' : ''} />

                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="email@exemplu.com" value={formData.email} onChange={handleChange} className={errors.email ? 'invalid-input' : ''} />

                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Parolă:</label>
                    <input type="password" id="password" name="password" placeholder="Minim 6 caractere" value={formData.password} onChange={handleChange} className={errors.password ? 'invalid-input' : ''} />

                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">Prenume:</label>
                        <input type="text" id="firstName" name="firstName" placeholder="Andrei ..." value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'invalid-input' : ''} />

                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nume:</label>
                        <input type="text" id="lastName" name="lastName" placeholder="Ionescu ..." value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'invalid-input' : ''} />

                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="address">Adresă:</label>
                    <input type="text" id="address" name="address" placeholder="Strada Exemplu, Nr. 10..." value={formData.address} onChange={handleChange} className={errors.address ? 'invalid-input' : ''} />

                    {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="age">Vârstă:</label>
                    <input type="number" id="age" name="age" placeholder="18" value={formData.age} onChange={handleChange} required min="18" className={errors.age ? 'invalid-input' : ''} />

                    {errors.age && <span className="error-message">{errors.age}</span>}
                </div>

                <button type="submit" className="submit-btn">
                    Creează cont
                </button>
            </form>

            <div className="auth-link">
                <p>Ai deja cont? <Link to="/login">Intră în cont</Link></p>
            </div>
        </div>
    );

}

export default RegisterPage;
