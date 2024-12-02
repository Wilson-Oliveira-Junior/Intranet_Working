import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/password.css';

const PasswordRegistration = () => {
    const { auth, clients } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        filter: '',
    });

    const [selectedClient, setSelectedClient] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPassword, setEditPassword] = useState(null);

    const handleFilterChange = (e) => {
        setData('filter', e.target.value);
        // Implement filter logic here
    };

    const handleAddPassword = () => {
        // Implement add password logic here
    };

    const handleViewPasswords = (client) => {
        setSelectedClient(client);
        fetch(`/clients/${client.id}/passwords`)
            .then(response => response.json())
            .then(data => {
                setPasswords(data);
                setShowModal(true);
            });
    };

    const handleDeletePasswords = (client) => {
        fetch(`/clients/${client.id}/passwords`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                // Refresh the client list or handle UI updates
            });
    };

    const handleEditPassword = (password) => {
        setEditPassword(password);
        setShowEditModal(true);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        fetch(`/passwords/${editPassword.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editPassword),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                setShowEditModal(false);
                // Refresh the password list or handle UI updates
            });
    };

    const handlePageChange = (url) => {
        Inertia.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Registro de Senha</h1>
                <div className="mb-4 flex justify-between items-center">
                    <input
                        type="text"
                        value={data.filter}
                        onChange={handleFilterChange}
                        placeholder="Buscar cliente..."
                        className="mt-1 block w-full max-w-xs"
                    />
                    <button
                        onClick={handleAddPassword}
                        className="bg-blue-500 text-white px-4 py-2 ml-4"
                    >
                        Adicionar Nova Senha
                    </button>
                </div>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Nome do Cliente (Domínio)</th>
                            <th className="py-2">Visualizar Detalhes</th>
                            <th className="py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.data.map((client) => (
                            <tr key={client.id}>
                                <td className="border px-4 py-2">{client.nome_fantasia}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2"
                                        onClick={() => handleViewPasswords(client)}
                                    >
                                        Visualizar
                                    </button>
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 mr-2"
                                        onClick={() => handleEditPassword(client)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2"
                                        onClick={() => handleDeletePasswords(client)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination">
                    {clients.links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(link.url)}
                            disabled={!link.url}
                            className={`px-4 py-2 border ${link.active ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                            <h2>Senhas de {selectedClient.nome_fantasia}</h2>
                            <ul>
                                {passwords.map((password) => (
                                    <li key={password.id}>
                                        {password.type} - {password.domain} - {password.url} - {password.login} - {password.password} - {password.adminOnly ? 'Sim' : 'Não'} - {password.notes}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
                            <h2>Editar Senha</h2>
                            <form onSubmit={handleUpdatePassword}>
                                <label>
                                    Tipo de Registro
                                    <input
                                        type="text"
                                        value={editPassword.type}
                                        onChange={(e) => setEditPassword({ ...editPassword, type: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Dominio
                                    <input
                                        type="text"
                                        value={editPassword.domain}
                                        onChange={(e) => setEditPassword({ ...editPassword, domain: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Url
                                    <input
                                        type="text"
                                        value={editPassword.url}
                                        onChange={(e) => setEditPassword({ ...editPassword, url: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Login
                                    <input
                                        type="text"
                                        value={editPassword.login}
                                        onChange={(e) => setEditPassword({ ...editPassword, login: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Senha
                                    <input
                                        type="text"
                                        value={editPassword.password}
                                        onChange={(e) => setEditPassword({ ...editPassword, password: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Somente Admin?
                                    <input
                                        type="checkbox"
                                        checked={editPassword.adminOnly}
                                        onChange={(e) => setEditPassword({ ...editPassword, adminOnly: e.target.checked })}
                                    />
                                </label>
                                <label>
                                    Observação
                                    <input
                                        type="text"
                                        value={editPassword.notes}
                                        onChange={(e) => setEditPassword({ ...editPassword, notes: e.target.value })}
                                    />
                                </label>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                                    Atualizar
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default PasswordRegistration;
