import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/detalhesclient.css';

interface Client {
    id: number;
    nome: string;
    email: string;
    razao_social: string;
    nome_fantasia: string;
    CNPJ: string;
    inscricao_estadual: string;
    segmento: string;
    melhor_dia_boleto: string;
    perfil_cliente: string;
    dominio: string;
    senhas: string;
    financeiro: string;
    gatilhos: string;
    tarefas: string;
    redes_sociais?: string[];
}

interface ClientDetailsProps {
    client: Client;
    auth: {
        user: {
            name: string;
        };
    };
}

const ClientDetails: React.FC = () => {
    const { client: initialClient, auth } = usePage<ClientDetailsProps>().props;
    const [client, setClient] = useState<Client>(initialClient);

    useEffect(() => {
        axios.get(`/clients/${client.id}`)
            .then(response => {
                setClient(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the client details!', error);
            });
    }, [client.id]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container">
                <div className="barralateral">
                    <div className="card">
                        <p>Identificação</p>
                        <p>{client.nome_fantasia}</p>
                        <p>{client.nome}</p>
                        <p>{client.dominio}</p>
                        <p><i className="fas fa-thumbs-up"></i></p>
                    </div>
                    <div className="card">
                        <p>Senhas</p>
                        <p>{client.senhas}</p>
                        <p><i className="fas fa-cogs"></i></p>
                    </div>
                    <div className="card">
                        <p>Financeiro</p>
                        <p>{client.financeiro}</p>
                        <p><i className="fas fa-cookie-bite"></i></p>
                    </div>
                    <div className="card">
                        <p>Gatilhos</p>
                        <p>{client.gatilhos}</p>
                        <p><i className="fas fa-check"></i></p>
                        <p>Detalhes do gatilho</p>
                    </div>
                    <div className="card">
                        <p>Tarefas</p>
                        <p>{client.tarefas}</p>
                        <p><i className="fas fa-tasks"></i></p>
                        <p>Detalhes da tarefa</p>
                    </div>
                    <div className="card">
                        <p>Redes Sociais</p>
                        {client.redes_sociais && client.redes_sociais.length > 0 ? (
                            client.redes_sociais.map((rede, index) => (
                                <p key={index}>{rede}</p>
                            ))
                        ) : (
                            <p>Nenhuma rede social definida</p>
                        )}
                        <p><i className="fas fa-hourglass-half"></i></p>
                        <p>Redes Sociais</p>
                    </div>
                </div>
                <div className="content">
                    <h2>Gatilhos para o cliente "{client.nome}"</h2>
                    <div className="task-list">
                        <div className="task">
                            <div className="details">
                                <p>Ficha Comercial</p>
                                <p>Data Limite: 28/05/2024 Data Conclusão: 02/07/2024 Quem Finalizou: Gabriela Barbosa de Sousa</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                        <div className="task">
                            <div className="details">
                                <p>Preenchimento do Briefing</p>
                                <p>Data Limite: 29/05/2024 Data Conclusão: 02/07/2024 Quem Finalizou: Gabriela Barbosa de Sousa</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                        <div className="task">
                            <div className="details">
                                <p>Entrega do Logo</p>
                                <p>Data Limite: 31/05/2024 Data Conclusão: 02/07/2024 Quem Finalizou: Gabriela Barbosa de Sousa</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                        <div className="task">
                            <div className="details">
                                <p>Apontamento do DEV</p>
                                <p>Data Limite: 31/05/2024 Data Conclusão: 02/07/2024 Quem Finalizou: Gabriela Barbosa de Sousa</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                    </div>
                    <h2>Tarefas para o cliente "{client.nome}"</h2>
                    <div className="task-list">
                        <div className="task">
                            <div className="details">
                                <p>Reunião de Planejamento</p>
                                <p>Data Limite: 01/06/2024 Data Conclusão: 05/06/2024 Quem Finalizou: João Silva</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                        <div className="task">
                            <div className="details">
                                <p>Desenvolvimento do Site</p>
                                <p>Data Limite: 10/06/2024 Data Conclusão: 20/06/2024 Quem Finalizou: Maria Oliveira</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                        <div className="task">
                            <div className="details">
                                <p>Teste de Qualidade</p>
                                <p>Data Limite: 15/06/2024 Data Conclusão: 25/06/2024 Quem Finalizou: Carlos Pereira</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                        <div className="task">
                            <div className="details">
                                <p>Entrega Final</p>
                                <p>Data Limite: 30/06/2024 Data Conclusão: 01/07/2024 Quem Finalizou: Ana Costa</p>
                            </div>
                            <div className="status">
                                <i className="fas fa-check-square"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientDetails;
