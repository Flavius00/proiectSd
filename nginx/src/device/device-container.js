import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row, CardBody } from 'reactstrap';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import DeviceForm from "./components/device-form";
import * as API_DEVICES from "./api/device-api";
import DeviceTable from "./components/device-table";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';


function DeviceContainer(props) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [editingDevice, setEditingDevice] = useState(null);
    const auth = useAuth();

    useEffect(() => {
        fetchDevices();
    }, []);

    function fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {
            if (result !== null && status === 200) {
                setTableData(result);
                setIsLoaded(true);
            } else {
                setError({ status: status, errorMessage: err });
            }
        });
    }

    function handleAdd() {
        setEditingDevice(null);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setEditingDevice(null);
    }

    function reload() {
        setIsLoaded(false);
        handleCloseModal();
        fetchDevices();
    }

    function handleEdit(device) {
        API_DEVICES.getDeviceById({ id: device.id }, (result, status, err) => {
            if (result !== null && status === 200) {
                setEditingDevice(result);
            }
        });
        setIsModalOpen(true);
    }

    function handleAssignToMe(device) {
        API_DEVICES.updateDevice({ id: device.id }, device, (result, status, err) => {
            if (status === 200 || status === 201) {
                alert(`Dispozitivul ${device.name} a fost atribuit cu succes.`);
                fetchDevices();
            } else {
                alert(`Eroare la atribuirea dispozitivului ${device.name}.`);
            }
        });
    }

    function handleDelete(device) {
        if (window.confirm(`Ești sigur că vrei să ștergi ${device.name}?`)) {
            API_DEVICES.deleteDevice({ id: device.id }, (result, status, err) => {
                if (status === 200 || status === 204) {
                    alert(`Dispozitivul ${device.name} a fost șters cu succes.`);
                    fetchDevices();
                } else {
                    alert(`Eroare la ștergerea dispozitivului ${device.name}.`);
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
                <CardHeader className="d-flex justify-content-between align-items-center">
                    <strong>Device Management</strong>
                    {auth.user && auth.user.role === 'admin' && (
                        <Button color="primary" onClick={handleAdd}>Add Device</Button>
                    )}
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col sm={{ size: '12', offset: 0 }}>
                            {isLoaded &&
                                <DeviceTable
                                    tableData={tableData}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onAssign={handleAssignToMe}
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
                <ModalHeader toggle={handleCloseModal}> {editingDevice ? "Edit Device" : "Add Device"} </ModalHeader>
                <ModalBody>
                    <DeviceForm
                        deviceToEdit={editingDevice}
                        reloadHandler={reload}
                    />
                </ModalBody>
            </Modal>
        </div >
    );
}

export default DeviceContainer;
