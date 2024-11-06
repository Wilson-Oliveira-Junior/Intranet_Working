import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
    email: string;
    sector: string;
    status: string;
    image?: string;
}

const Users: React.FC = () => {
    const { users, user } = usePage().props as { users: User[], user: any };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [successMessage, setSuccessMessage] = useState<string>('');

    // Função para alternar o status
    const toggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        Inertia.put(`/admin/users/${id}/status`, { status: newStatus }, {
            onSuccess: () => {
                setSuccessMessage(`Status do usuário atualizado para ${newStatus}!`);
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Função para deletar o usuário
    const handleDeleteUser = (id: number) => {
        if (window.confirm('Tem certeza de que deseja deletar este usuário?')) {
            Inertia.delete(`/admin/users/${id}`, {
                onSuccess: () => {
                    setSuccessMessage('Usuário deletado com sucesso!');
                },
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Painel de Controle de Usuários</h1>

                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Setor</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        {user.image ? (
                                            <img src={user.image} alt="Imagem do usuário" width="50" height="50" />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.sector}</td>
                                    <td>
                                        <button
                                            className={`btn status ${user.status === 'Ativo' ? 'on' : 'off'}`}
                                            onClick={() => toggleStatus(user.id, user.status)}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn editar">Editar</button>
                                        <button className="btn papel">Papel</button>
                                        <button
                                            className="btn deletar"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default Users;
