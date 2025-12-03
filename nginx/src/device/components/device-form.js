import React, { useState, useEffect } from 'react';
import './styles/device-form.css';
import { requiredValidator, minLengthValidator } from './validators/device-validators';
import * as API_DEVICES from '../api/device-api';
import * as API_USERS from '../../user/api/user-api';
import { useAuth } from '../../hooks/auth';

const formRules = {
    name: [
        { rule: requiredValidator, message: 'Numele este obligatoriu.' },
        { rule: (value) => minLengthValidator(value, 3), message: 'Numele trebuie să aibă minim 3 caractere.' }
    ],
    maximumConsumption: [
        { rule: (value) => parseFloat(value) > 0, message: 'Consumul trebuie să fie mai mare ca 0.' }
    ],
};

const emptyState = {
    name: '',
    maximumConsumption: '',
    userId: '',
}

function DeviceForm({ reloadHandler, deviceToEdit }) {

    const [formData, setFormData] = useState(emptyState);
    const [errors, setErrors] = useState({});

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                setUserList(result);
            } else {
                console.error("Eroare la încărcarea listei de utilizatori:", err);
            }
        });
    }, []);

    useEffect(() => {
        if (deviceToEdit) {
            setFormData({
                name: deviceToEdit.name || '',
                maximumConsumption: deviceToEdit.maximumConsumption || '',
                userId: deviceToEdit.userId || '',
            });
        } else {
            setFormData(emptyState);
        }
        setErrors({});
    }, [deviceToEdit]);

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

        const dataToSend = {
            ...formData,
            maximumConsumption: parseFloat(formData.maximumConsumption)
        };

        if (deviceToEdit) {
            API_DEVICES.updateDevice({ id: deviceToEdit.id }, dataToSend, (result, status, err) => {
                if (status === 200) {
                    alert('Dispozitiv modificat cu succes!');
                    reloadHandler();
                } else {
                    alert(`Eroare la modificare: ${err || 'Eroare necunoscută'}`);
                }
            });
        } else {
            API_DEVICES.postDevice(dataToSend, (result, status, err) => {
                if (status === 200 || status === 201) {
                    alert('Dispozitiv salvat cu succes!');
                    reloadHandler();
                } else {
                    alert(`Eroare la salvare: ${err || 'Eroare necunoscută'}`);
                }
            });
        }
    };

    const auth = useAuth();
    if (!auth.user || auth.user.role !== 'admin') {
        return (
            <div className="auth-container">
                <h2 style={{ textAlign: 'center', color: 'red' }}>Acces interzis</h2>
            </div>
        );
    }

    return (
        <form className="device-form" onSubmit={handleSubmit} noValidate>

            <div className="form-group">
                <label htmlFor="name">Nume Dispozitiv:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="ex: Senzor Sufragerie"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'invalid-input' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="maximumConsumption">Consum Maxim (kW):</label>
                <input
                    type="number"
                    step="0.01"
                    id="maximumConsumption"
                    name="maximumConsumption"
                    placeholder="ex: 50.5"
                    value={formData.maximumConsumption}
                    onChange={handleChange}
                    className={errors.maximumConsumption ? 'invalid-input' : ''}
                />
                {errors.maximumConsumption && <span className="error-message">{errors.maximumConsumption}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="userId">Utilizator Asignat:</label>
                <select
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className={errors.userId ? 'invalid-input' : ''}
                >
                    <option value="">-- Selectează un utilizator --</option>

                    {userList.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
                {errors.userId && <span className="error-message">{errors.userId}</span>}
            </div>

            <button type="submit" className="submit-btn">
                {deviceToEdit ? 'Actualizează Dispozitiv' : 'Salvează Dispozitiv'}
            </button>
        </form>
    );
}

export default DeviceForm;
