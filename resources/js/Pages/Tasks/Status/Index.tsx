import React, { useState } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/status.css';

const StatusIndex = ({ auth, statuses: initialStatuses, links: initialLinks }) => {
    const { csrf_token } = usePage().props;
    const [statuses, setStatuses] = useState(initialStatuses);
    const [links, setLinks] = useState(initialLinks);

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';

        try {
            await axios.put(`/status/${id}`, { status: newStatus }, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
            });

            const updatedStatuses = statuses.data.map((status) => {
                if (status.id === id) {
                    return { ...status, status: newStatus };
                }
                return status;
            });

            setStatuses({ ...statuses, data: updatedStatuses });
        } catch (error) {
            console.error('Erro ao atualizar o status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar este status?')) {
            try {
                await axios.delete(`/status/${id}`, {
                    headers: {
                        'X-CSRF-TOKEN': csrf_token,
                    },
                });

                const updatedStatuses = statuses.data.filter((status) => status.id !== id);
                setStatuses({ ...statuses, data: updatedStatuses });
            } catch (error) {
                console.error('Erro ao deletar o status:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Status List" />
            <div className="container">
                <h1>Status</h1>
                <Link href="/status/create" className="btn btn-primary">Criar um novo Status</Link>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.data.map(status => (
                            <tr key={status.id}>
                                <td>{status.name}</td>
                                <td>{status.description}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={status.status === 'Ativo'}
                                            onChange={() => handleStatusChange(status.id, status.status)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <Link href={`/status/${status.id}/edit`} className="btn btn-warning">Editar</Link>
                                    <button onClick={() => handleDelete(status.id)} className="btn btn-danger">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div dangerouslySetInnerHTML={{ __html: links }} />
            </div>
        </AuthenticatedLayout>
    );
};

export default StatusIndex;
