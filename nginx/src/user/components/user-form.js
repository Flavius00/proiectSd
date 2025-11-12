import React, { useState, useEffect } from 'react';
import './styles/user-form.css';
import { requiredValidator, minLengthValidator, emailValidator } from './validators/user-validators';
import * as API_USERS from '../api/user-api';
import * as API_AUTH from '../../auth/api/auth-api';
import useAuth from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';

const formRules = {
    username: [
        { rule: requiredValidator, message: 'Username-ul este obligatoriu.' },
        { rule: (value) => minLengthValidator(value, 3), message: 'Username-ul trebuie să aibă minim 3 caractere.' }
    ],
    email: [
        { rule: requiredValidator, message: 'Email-ul este obligatoriu.' },
        { rule: emailValidator, message: 'Email-ul nu e valid.' }
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
    firstName: '',
    lastName: '',
    address: '',
    age: '',
}

function UserForm({ reloadHandler, userToEdit }) {

    const [formData, setFormData] = useState(emptyState);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                username: userToEdit.username,
                firstName: userToEdit.firstName,
                lastName: userToEdit.lastName,
                address: userToEdit.address,
                age: userToEdit.age,
                email: userToEdit.email,
            });
            console.log("Editing user:", userToEdit);
        }
        else {
            setFormData(emptyState);
        }

        setErrors({});

    }, [userToEdit]);

    const validateField = (name, value) => {
        const rules = formRules[name];
        if (!rules) {
            return '';
        }

        for (const item of rules) {
            if (!item.rule(value)) {
                return item.message;
            }
        }
        return '';
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        const errorMessage = validateField(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
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

        if (userToEdit) {
            console.log("Editing user:", userToEdit);
            const authUserToEdit = {
                id: userToEdit.id,
                username: formData.username,
                email: formData.email,
                password: 'a',
            }
            console.log("Auth data to edit:", authUserToEdit);
            const userToEditPost = {
                id: userToEdit.id,
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                age: formData.age,
            }

            API_USERS.updateUser({ id: userToEdit.id }, userToEditPost, (result, status, err) => {
                if (status === 200) {
                    alert('Utilizator modificat cu succes!');
                    reloadHandler();
                } else {
                    alert(`Eroare la modificare: ${err || 'Eroare necunoscută'}`);
                }
            });

            API_AUTH.updateAuth(userToEdit.id, authUserToEdit, (result, status, err) => {
                if (status === 200) {
                    console.log("Auth data updated successfully.");
                } else {
                    console.log(`Eroare la modificare auth: ${err || 'Eroare necunoscută'}`);
                }
            });

        } else {
            alert('Funcționalitatea de creare utilizator nu este implementată încă.');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    if (userToEdit) {
        if (user.role !== 'admin' && user.id !== userToEdit.id) {
            return (
                <div className="auth-container">
                    <h2 style={{ textAlign: 'center', color: 'red' }}>Acces interzis</h2>
                    <p>Nu ai permisiunea de a edita acest utilizator.</p>
                </div>
            );
        }
    }
    else {
        if (user.role !== 'admin') {
            return (
                <div className="auth-container">
                    <h2 style={{ textAlign: 'center', color: 'red' }}>Acces interzis</h2>
                    <p>Doar administratorii pot crea utilizatori noi.</p>
                </div>
            );
        }
    }

    return (

        <div className="auth-container">
            <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
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
                    {userToEdit ? 'Salvează modificările' : 'Creează cont'}
                </button>
            </form>
        </div>
    );
}

export default UserForm;
