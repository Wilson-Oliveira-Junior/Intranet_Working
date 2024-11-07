import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/users.css';

interface User {
    id: number;
    name: string;
    email: string;
    sector: string;
    status: string;
    image?: string;
}

interface UserType {
    id: number;
    name: string;
}

const Users: React.FC = () => {
    const { users, user, userTypes } = usePage().props as { users: User[], user: any, userTypes: UserType[] };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

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

    // Função para atribuir papel ao usuário
    const handleAssignRole = () => {
        if (selectedUserType && userId) {
            Inertia.put(`/admin/users/${userId}/assign-role`, { user_type_id: selectedUserType }, {
                onSuccess: () => {
                    setShowModal(false);
                    setSuccessMessage('Papel atribuído com sucesso!');
                },
                preserveState: true,
                preserveScroll: true,
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
                                        <button
                                            className="btn papel"
                                            onClick={() => {
                                                setUserId(user.id);
                                                setShowModal(true);
                                            }}
                                        >
                                            Papel
                                        </button>
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

                {showModal && (
                    <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
                        <div className="modal-content">
                            <h2>Atribuir Papel</h2>
                            <select
                                onChange={(e) => setSelectedUserType(Number(e.target.value))}
                                value={selectedUserType || ''}
                            >
                                <option value="">Selecione um tipo de usuário</option>
                                {userTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAssignRole}>Atribuir</button>
                            <button onClick={() => setShowModal(false)} className="cancelar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
};

export default Users;
