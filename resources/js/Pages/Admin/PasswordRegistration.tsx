import React, { useState, useEffect } from 'react';
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
    const [clientOptions, setClientOptions] = useState([]);

    useEffect(() => {
        // Fetch clients for autocomplete
        fetch('/clients')
            .then(response => response.json())
            .then(data => setClientOptions(data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    const handleFilterChange = (e) => {
        setData('filter', e.target.value);
        // Implement filter logic here
    };

    const handleAddPassword = () => {
        setEditPassword({ strURL: '', strLogin: '', strSenha: '', observacao: '', idCliente: '' });
        setShowEditModal(true);
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        const method = editPassword.id ? 'PUT' : 'POST';
        const url = editPassword.id ? `/passwords/${editPassword.id}` : `/clients/${editPassword.idCliente}/passwords`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editPassword),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                setShowEditModal(false);
                handleViewPasswords(selectedClient); // Refresh the password list
            })
            .catch(error => {
                console.error('Error saving password:', error);
                alert('Failed to save password. Please try again.');
            });
    };

    const handleViewPasswords = (client) => {
        setSelectedClient(client);
        fetch(`/clients/${client.id}/passwords`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPasswords(data);
                } else {
                    setPasswords([]);
                }
                setShowModal(true);
            })
            .catch(error => {
                console.error('Error fetching passwords:', error);
                alert('Failed to fetch passwords. Please try again.');
            });
    };

    const handleDeletePasswords = (client) => {
        fetch(`/clients/${client.id}/passwords`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                // Refresh the client list or handle UI updates
            })
            .catch(error => {
                console.error('Error deleting passwords:', error);
                alert('Failed to delete passwords. Please try again.');
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
            })
            .catch(error => {
                console.error('Error updating password:', error);
                alert('Failed to update password. Please try again.');
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
                        {clients.data.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No clients found.</td>
                            </tr>
                        ) : (
                            clients.data.map((client) => (
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
                                            Adicionar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2"
                                            onClick={() => handleDeletePasswords(client)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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
                            {link.label === 'Next &raquo;' ? 'Próximo' : link.label === '&laquo; Previous' ? 'Anterior' : link.label}
                        </button>
                    ))}
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                            <h2>Senhas de {selectedClient.nome_fantasia}</h2>
                            {passwords.length === 0 ? (
                                <p>Sem senhas registradas no banco.</p>
                            ) : (
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2">Login</th>
                                            <th className="py-2">Senha</th>
                                            <th className="py-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {passwords.map((password) => (
                                            <tr key={password.idRegistroSenha}>
                                                <td className="border px-4 py-2">{password.strLogin}</td>
                                                <td className="border px-4 py-2">{password.strSenha}</td>
                                                <td className="border px-4 py-2">
                                                    <button
                                                        className="btn editar"
                                                        onClick={() => handleEditPassword(password)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn deletar"
                                                        onClick={() => handleDeletePasswords(password)}
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <button
                                className="btn adicionar mt-4"
                                onClick={handleAddPassword}
                            >
                                Adicionar Nova Senha
                            </button>
                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
                            <h2>{editPassword.id ? 'Editar Senha' : 'Adicionar Nova Senha'}</h2>
                            <form onSubmit={handleSavePassword}>
                                <label>
                                    Cliente
                                    <input
                                        type="text"
                                        list="client-options"
                                        value={editPassword.idCliente}
                                        onChange={(e) => setEditPassword({ ...editPassword, idCliente: e.target.value })}
                                    />
                                    <datalist id="client-options">
                                        {clientOptions.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.nome_fantasia}
                                            </option>
                                        ))}
                                    </datalist>
                                </label>
                                <label>
                                    URL
                                    <input
                                        type="text"
                                        value={editPassword.strURL}
                                        onChange={(e) => setEditPassword({ ...editPassword, strURL: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Login
                                    <input
                                        type="text"
                                        value={editPassword.strLogin}
                                        onChange={(e) => setEditPassword({ ...editPassword, strLogin: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Senha
                                    <input
                                        type="text"
                                        value={editPassword.strSenha}
                                        onChange={(e) => setEditPassword({ ...editPassword, strSenha: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Observação
                                    <input
                                        type="text"
                                        value={editPassword.observacao}
                                        onChange={(e) => setEditPassword({ ...editPassword, observacao: e.target.value })}
                                    />
                                </label>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                                    {editPassword.id ? 'Atualizar' : 'Adicionar'}
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
