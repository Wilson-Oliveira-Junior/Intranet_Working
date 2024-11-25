import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import GuestLayout from '@/Layouts/GuestLayout';

const ClientList = () => {
    const { clients, canEdit, auth } = usePage().props;

    const handleEdit = (id) => {
        Inertia.put(`/clients/${id}/edit`);
    };

    return (
        <GuestLayout user={auth.user}>
            <h1>Listagem de Clientes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>
                                {canEdit && (
                                    <button onClick={() => handleEdit(client.id)}>Editar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </GuestLayout>
    );
};

export default ClientList;
