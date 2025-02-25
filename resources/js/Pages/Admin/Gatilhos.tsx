import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/gatilhos.css';

interface Client {
    id: number;
    name: string;
}

interface TipoProjeto {
    id: number;
    nome: string;
}

interface User {
    id: number;
    name: string;
}

interface Gatilho {
    id: number;
    gatilho: string;
    nome_tipo_projeto: string;
    dias_limite_padrao: number;
    dias_limite_50: number;
    dias_limite_40: number;
    dias_limite_30: number;
    tipo_gatilho: string;
    client_id: number;
    id_tipo_projeto: number;
    status: string;
}

const Gatilhos: React.FC = () => {
    const { clients, projectTypes, user, arrGatilhos } = usePage().props as {
        clients: Client[],
        projectTypes: TipoProjeto[],
        user: User,
        arrGatilhos: Gatilho[]
    };

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProjectType, setSelectedProjectType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filteredGatilhos, setFilteredGatilhos] = useState<Gatilho[]>(arrGatilhos || []);

    const handleFilter = () => {
        const filtered = (arrGatilhos || []).filter(gatilho => {
            const clientMatch = selectedClient ? gatilho.client_id === parseInt(selectedClient) : true;
            const projectTypeMatch = selectedProjectType ? gatilho.id_tipo_projeto === parseInt(selectedProjectType) : true;
            const statusMatch = selectedStatus ? gatilho.status === selectedStatus : true;
            return clientMatch && projectTypeMatch && statusMatch;
        });
        setFilteredGatilhos(filtered);
    };

    if (!clients) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Painel de Controle de Gatilhos</h1>

                <div className="filters">
                    <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                        <option value="">Selecione um Cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>

                    <select value={selectedProjectType} onChange={(e) => setSelectedProjectType(e.target.value)}>
                        <option value="">Selecione o Tipo de Projeto</option>
                        {projectTypes.map(projectType => (
                            <option key={projectType.id} value={projectType.id}>{projectType.nome}</option>
                        ))}
                    </select>

                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">Selecione o Status</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Finalizados">Finalizados</option>
                        <option value="Pausados">Pausados</option>
                    </select>

                    <button onClick={handleFilter}>Filtrar</button>
                </div>

                <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                            <tr>
                                <th>Status</th>
                                <th>Cliente</th>
                                <th>Tipo de Projeto</th>
                                <th>Finalizados</th>
                                <th>Total</th>
                                <th>Processo</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGatilhos.length > 0 ? (
                                filteredGatilhos.map(gatilho => (
                                    <tr key={gatilho.id}>
                                        <td>{gatilho.status}</td>
                                        <td>{gatilho.client_id}</td>
                                        <td>{gatilho.nome_tipo_projeto}</td>
                                        <td>{gatilho.dias_limite_padrao}</td>
                                        <td>{gatilho.dias_limite_50}</td>
                                        <td>{gatilho.dias_limite_40}</td>
                                        <td>{gatilho.dias_limite_30}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">Nenhum gatilho encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Gatilhos;
