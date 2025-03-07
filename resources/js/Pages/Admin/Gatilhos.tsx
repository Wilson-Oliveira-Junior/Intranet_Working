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
    status: string;
    cliente: string; // Incluindo a coluna cliente
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
        console.log('Selected Client:', selectedClient);
        console.log('Selected Project Type:', selectedProjectType);
        console.log('Selected Status:', selectedStatus);
        console.log('arrGatilhos:', arrGatilhos);

        const filtered = (arrGatilhos || []).filter(gatilho => {
            const clientMatch = selectedClient ? gatilho.cliente === selectedClient : true;
            const projectTypeMatch = selectedProjectType ? gatilho.id_tipo_projeto === parseInt(selectedProjectType) : true;
            const statusMatch = selectedStatus ? gatilho.status === selectedStatus : true;
            return clientMatch && projectTypeMatch && statusMatch;
        });

        console.log('Filtered Gatilhos:', filtered);
        setFilteredGatilhos(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [selectedClient, selectedProjectType, selectedStatus]);

    useEffect(() => {
        console.log('Clients:', clients);
        console.log('Project Types:', projectTypes);
        console.log('User:', user);
        console.log('arrGatilhos:', arrGatilhos);
    }, [clients, projectTypes, user, arrGatilhos]);

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
                            <option key={client.id} value={client.name}>{client.name}</option>
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
                                <th>Progresso</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGatilhos.length > 0 ? (
                                filteredGatilhos.map(gatilho => (
                                    <tr key={gatilho.id}>
                                        <td>{gatilho.status}</td>
                                        <td>{gatilho.cliente}</td>
                                        <td>{gatilho.nome_tipo_projeto}</td>
                                        <td>{gatilho.dias_limite_padrao}</td>
                                        <td>{gatilho.dias_limite_50}</td>
                                        <td>
                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" style={{ width: `${gatilho.dias_limite_40}%` }} aria-valuenow={gatilho.dias_limite_40} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </td>
                                        <td>
                                            <a href={`gatilhos/acompanhar/${gatilho.id}`} className="btn btn-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tasks" viewBox="0 0 16 16">
                                                    <path d="M1 9.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z" />
                                                    <path d="M2 5.5a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5z" />
                                                </svg>
                                            </a>
                                            <a href={`gatilhos/comentar/${gatilho.id}`} className="btn btn-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-square-dots-fill" viewBox="0 0 16 16">
                                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                                </svg>
                                            </a>
                                            <a href={`gatilhos/pausar/${gatilho.id}`} className="btn btn-warning btn-pause">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16">
                                                    <path d="M5.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center">Nenhum gatilho encontrado.</td>
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
