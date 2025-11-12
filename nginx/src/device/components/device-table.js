import React from 'react';
import { Table, Button } from 'reactstrap';
import './styles/device-table.css';
import { useAuth } from '../../hooks/auth';

function DeviceTable({ tableData, onEdit, onDelete, onAssign }) {

    const auth = useAuth();

    if (!auth.user) {
        return (
            <div className="auth-container">
                <h2 style={{ textAlign: 'center', color: 'red' }}>Acces interzis</h2>
            </div>
        );
    }

    function assignToMe(device) {
        const updatedDevice = { ...device, userId: auth.user.id };
        console.log("Assigning device:", updatedDevice);
        onAssign(updatedDevice);
    }

    return (
        <Table striped bordered hover responsive className="device-table" style={{ borderRadius: '8px' }}>
            <thead style={{ textAlign: 'center' }}>
                <tr>
                    <th>Nume Dispozitiv</th>
                    <th>Actiuni</th>
                </tr>
            </thead>

            <tbody style={{ textAlign: 'center' }}>
                {tableData.map((device) => (
                    <tr key={device.id}>

                        <td>{device.name}</td>

                        <td className="actions-cell">
                            {auth.user.role === 'admin' ? (
                                <>
                                    <Button
                                        color="warning"
                                        size="sm"
                                        className="btn-edit"
                                        onClick={() => onEdit(device)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="danger"
                                        size="sm"
                                        className="btn-delete"
                                        onClick={() => onDelete(device)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            ) : (
                                device.userId === null ? (
                                    <Button
                                        color="warning"
                                        size="sm"
                                        className="btn-edit"
                                        onClick={() => assignToMe(device)}
                                    >
                                        Assign to Me
                                    </Button>
                                )
                                    : (
                                        <span>Device Assignat</span>
                                    )
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default DeviceTable;
