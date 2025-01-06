import React, { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Layout from '@/Layouts/Layout';
import { Inertia } from '@inertiajs/inertia';
import '../../../css/components/password.css'; // Importação do CSS

const RegistroSenha = () => {
    const { clients, query } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(query || '');
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(route('clients.search'), { query: searchQuery });
    };

    const handleViewPasswords = (client) => {
        setSelectedClient(client);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClient(null);
    };

    return (
        <div className="registro-senha-container">
            <h1>Registro de Senha</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome ou email"
                />
                <button type="submit">Buscar</button>
            </form>
            <table className="clients-table">
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
                            <td>{client.nome}</td>
                            <td>{client.email}</td>
                            <td>
                                <button onClick={() => handleViewPasswords(client)} className="edit-link">Visualizar Senhas</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Senhas do Cliente</h2>
                        {selectedClient && (
                            <div>
                                {/* Renderize as senhas do cliente aqui */}
                                <p>Nome: {selectedClient.nome}</p>
                                <p>Email: {selectedClient.email}</p>
                                {/* Adicione mais detalhes conforme necessário */}
                                <button className="btn editar">Editar</button>
                                <button className="btn deletar">Excluir</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

RegistroSenha.layout = page => <Layout children={page} />;

export default RegistroSenha;
