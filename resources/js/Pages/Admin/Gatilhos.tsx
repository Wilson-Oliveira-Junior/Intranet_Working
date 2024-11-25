import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/gatilhos.css';

const Gatilhos: React.FC = () => {
    const { users, user, userTypes, sectors, clients, arrGatilhos } = usePage().props as {
        users: User[],
        user: User,
        userTypes: UserType[],
        sectors: Sector[],
        clients: Client[],
        arrGatilhos: Gatilho[]
    };

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProjectType, setSelectedProjectType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [projectTypes, setProjectTypes] = useState<TipoProjeto[]>([]);
    const [filteredGatilhos, setFilteredGatilhos] = useState<Gatilho[]>(arrGatilhos || []);

    useEffect(() => {
        fetch('/admin/project-types')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setProjectTypes(data))
            .catch(error => console.error('Error fetching project types:', error));
    }, []);

    const handleFilter = () => {
        const filtered = (arrGatilhos || []).filter(gatilho => {
            const clientMatch = selectedClient ? gatilho.client_id === selectedClient : true;
            const projectTypeMatch = selectedProjectType ? gatilho.project_type_id === selectedProjectType : true;
            const statusMatch = selectedStatus ? gatilho.status === selectedStatus : true;
            return clientMatch && projectTypeMatch && statusMatch;
        });
        setFilteredGatilhos(filtered);
    };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Painel de Controle de Usuários</h1>

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
                                filteredGatilhos.map(projeto => (
                                    <tr key={projeto.id}>
                                        <td id={`status-${projeto.id}`}>
                                            {!projeto.entraremcontato ? (
                                                <span className="atendimento-em-dia">ATENDIMENTO EM DIA</span>
                                            ) : (
                                                <span className="entrar-em-contato">ENTRAR EM CONTATO</span>
                                            )}
                                        </td>
                                        <td>
                                            {projeto.nome.length >= 30
                                                ? `${projeto.nome.substring(0, 30)}...`
                                                : projeto.nome}
                                        </td>
                                        <td>{projeto.tipo_projeto}</td>
                                        <td>{projeto.finalizados}</td>
                                        <td>{projeto.gatilhos}</td>
                                        <td>
                                            <small>Processo está em: {((projeto.finalizados / projeto.gatilhos) * 100).toFixed(2)}%</small>
                                            <div className="progress progress-xs my-2">
                                                <div className="progress-bar bg-success" style={{ width: `${(projeto.finalizados / projeto.gatilhos) * 100}%` }}></div>
                                            </div>
                                        </td>
                                        <td>
                                            <a href={`/backend/gatilhos/projeto/${projeto.id}`} className="btn" style={{ backgroundColor: '#00cdf1', color: '#FFF' }} title="Acompanhar Processo">
                                                <i className="fa fa-tasks" aria-hidden="true"></i>
                                            </a>
                                            <button type="button" className="btn btn-comentario" data-id={projeto.id} style={{ color: '#FFF', background: '#5c6ce8' }} title="Comentar">
                                                <i className="fa fa-comment"></i>
                                            </button>
                                            {projeto.status !== 'F' && (
                                                <button
                                                    type="button"
                                                    id={`btnstatus-${projeto.id}`}
                                                    className={`btn btn-status ${projeto.status === 'P' ? 'btn-play' : 'btn-pause'}`}
                                                    data-id={projeto.id}
                                                    data-status={projeto.status}
                                                    style={{ color: '#FFF' }}
                                                    title={projeto.status === 'P' ? 'Continuar' : 'Pausar'}
                                                >
                                                    <i className={`fa fa-${projeto.status === 'P' ? 'play' : 'pause'}`} id={`icon-${projeto.id}`} aria-hidden="true"></i>
                                                </button>
                                            )}
                                        </td>
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
