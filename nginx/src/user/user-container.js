import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row, CardBody } from 'reactstrap';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import UserForm from "./components/user-form";
import * as API_USERS from "./api/user-api";
import * as API_AUTH from "../auth/api/auth-api";
import UserTable from "./components/user-table";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

function UserContainer(props) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [editingUser, setEditingUser] = useState(null);

    const auth = useAuth();



    useEffect(() => {
        fetchUsers();
    }, []);

    function fetchUsers() {
        return API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                setTableData(result);
                setIsLoaded(true);
            } else {
                setError({ status: status, errorMessage: err });
            }
        });
    }

    function handleAdd() {
        setEditingUser(null);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setEditingUser(null);
    }

    function reload() {
        setIsLoaded(false);
        handleCloseModal();
        fetchUsers();
    }

    function handleEdit(user) {
        let combinedUserData = {};

        API_USERS.getUserById({ id: user.id }, (profileResult, profileStatus, profileErr) => {

            if (profileResult !== null && profileStatus === 200) {
                combinedUserData = { ...profileResult };

                API_AUTH.getAuthById(user.id, (authResult, authStatus, authErr) => {

                    if (authResult !== null && authStatus === 200) {
                        combinedUserData.email = authResult.email;
                        combinedUserData.password = authResult.password;

                        console.log("Combined user data for editing:", combinedUserData);

                        setEditingUser(combinedUserData);
                        setIsModalOpen(true);

                    } else {
                        setError({ status: authStatus, errorMessage: authErr });
                        alert("Eroare la preluarea datelor de autentificare.");
                    }
                });

            } else {
                setError({ status: profileStatus, errorMessage: profileErr });
                alert("Eroare la preluarea datelor de profil.");
            }
        });
    }

    function handleDelete(user) {
        if (window.confirm(`Ești sigur că vrei să ștergi ${user.id}?`)) {
            API_USERS.deleteUser({ id: user.id }, (result, status, err) => {
                if (status === 200) {
                    alert(`Utilizatorul ${user.lastName} a fost șters cu succes.`);
                    fetchUsers();
                } else {
                    alert(`Eroare la ștergerea utilizatorului ${user.lastName}.`);
                }
            });
            API_AUTH.deleteAuth(user.id, (result, status, err) => {
                if (status === 200) {
                    console.log(`Datele de autentificare pentru utilizatorul ${user.id} au fost șterse cu succes.`);
                } else {
                    console.log(`Eroare la ștergerea datelor de autentificare pentru utilizatorul ${user.id}.`);
                }
            });
        }
    }

    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <Card>
                <CardBody>
                    <Row>
                        <Col sm={{ size: '12', offset: 0 }}>
                            {isLoaded &&
                                <UserTable
                                    tableData={tableData}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            }
                            {error.status > 0 &&
                                <APIResponseErrorMessage
                                    errorStatus={error.status}
                                    error={error.errorMessage}
                                />}
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Modal isOpen={isModalOpen} toggle={handleCloseModal} size="lg">
                <ModalHeader toggle={handleCloseModal}> {editingUser ? "Edit User" : "Add User"} </ModalHeader>
                <ModalBody>
                    <UserForm userToEdit={editingUser}
                        reloadHandler={reload}
                    />
                </ModalBody>
            </Modal>
        </div >
    );
}

export default UserContainer;
