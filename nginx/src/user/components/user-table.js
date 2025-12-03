import React from 'react';
import { Table, Button } from 'reactstrap';
import './styles/user-table.css';
import { useAuth } from '../../hooks/auth';

function UserTable({ tableData, onEdit, onDelete }) {

    const auth = useAuth();

    if (!auth.user) {
        return (
            <div className="auth-container">
                <h2 style={{ textAlign: 'center', color: 'red' }}>Acces interzis</h2>
            </div>
        );
    }

    return (
        <Table striped bordered hover responsive className="user-table" style={{ borderRadius: '8px' }}>
            <thead style={{ textAlign: 'center' }}>
                <tr>
                    <th>Username</th>
                    <th>Varsta</th>
                    <th>Actiuni</th>
                </tr>
            </thead>

            <tbody style={{ textAlign: 'center' }}>
                {tableData.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.age}</td>

                        <td className="actions-cell">
                            {auth.user.role === 'admin' ? (
                                <>
                                    <Button
                                        color="warning"
                                        size="sm"
                                        className="btn-edit"
                                        onClick={() => onEdit(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="danger"
                                        size="sm"
                                        className="btn-delete"
                                        onClick={() => onDelete(user)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            ) : (
                                auth.user.id === user.id ? (
                                    <Button
                                        color="warning"
                                        size="sm"
                                        className="btn-edit"
                                        onClick={() => onEdit(user)}
                                    >
                                        Edit
                                    </Button>
                                ) : (
                                    <span>Not authorized to edit this user</span>
                                )
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default UserTable;
