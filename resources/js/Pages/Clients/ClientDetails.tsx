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

interface Contact {
    nome_contato: string;
    telefone: string;
    celular: string;
    email: string;
}

interface Password {
    strURL: string;
    strLogin: string;
    strSenha: string;
    observacao: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    status: string;
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
    const [contact, setContact] = useState<Contact | null>(null);
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [currentPasswordIndex, setCurrentPasswordIndex] = useState(0);
    const [openTasksCount, setOpenTasksCount] = useState(0);

    useEffect(() => {
        console.log('Fetching client details for ID:', initialClient.id);
        axios.get(`/clients/${initialClient.id}/details`)
            .then(response => {
                console.log('Client details fetched:', response.data);
                setClient(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the client details!', error);
            });

        axios.get(`/clients/${initialClient.id}/contacts`)
            .then(response => {
                console.log('Client contacts fetched:', response.data);
                if (response.data.length > 0) {
                    setContact(response.data[0]); // Assuming the first contact is the responsible person
                }
            })
            .catch(error => {
                console.error('There was an error fetching the client contacts!', error);
            });

        axios.get(`/clients/${initialClient.id}/passwords`)
            .then(response => {
                setPasswords(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the client passwords!', error);
            });

        axios.get(`/clients/${initialClient.id}/open-tasks-count`)
            .then(response => {
                console.log('Open tasks count fetched:', response.data);
                setOpenTasksCount(response.data.openTasksCount);
            })
            .catch(error => {
                console.error('There was an error fetching the open tasks count!', error);
            });

        axios.get(`/clients/${initialClient.id}/tasks`)
            .then(response => {
                console.log('Tasks fetched:', response.data);
                setTasks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
            });
    }, [initialClient.id]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleNextPassword = () => {
        setCurrentPasswordIndex((prevIndex) => (prevIndex + 1) % passwords.length);
    };

    const handlePrevPassword = () => {
        setCurrentPasswordIndex((prevIndex) => (prevIndex - 1 + passwords.length) % passwords.length);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container">
                <div className="barralateral">
                    <div className="card">
                        <p>Identificação</p>
                        <p>{client.nome_fantasia}</p>
                        <p>{contact ? contact.nome_contato : 'Responsável não definido'}</p>
                        <p><a href={`http://${client.dominio}`} target="_blank" rel="noopener noreferrer">{client.dominio}</a></p>
                        <p><i className="fas fa-thumbs-up"></i></p>
                    </div>
                    <div className="card">
                        <p>Senhas</p>
                        <p>
                            <button onClick={togglePasswordVisibility}>
                                {showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
                            </button>
                        </p>
                        {passwords.length > 0 && (
                            <div>
                                <p className="password-field">URL: {passwords[currentPasswordIndex].strURL}</p>
                                <p className="password-field">Login: {passwords[currentPasswordIndex].strLogin}</p>
                                <p className="password-field">Senha: {showPassword ? passwords[currentPasswordIndex].strSenha : '********'}</p>
                                <p className="password-field">Observação: {passwords[currentPasswordIndex].observacao}</p>
                                <div className="carousel-controls">
                                    <button onClick={handlePrevPassword} disabled={passwords.length <= 1}>Anterior</button>
                                    <button onClick={handleNextPassword} disabled={passwords.length <= 1}>Próximo</button>
                                </div>
                            </div>
                        )}
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
                        <p>{openTasksCount}</p>
                        <p><i className="fas fa-tasks"></i></p>
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
                    <h2>Gatilhos para o cliente {client.nome_fantasia}</h2>
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
                    <h2>Tarefas Abertas para o cliente {client.nome_fantasia}</h2>
                    <div className="task-list">
                        {tasks.map(task => (
                            <div className="task" key={task.id}>
                                <div className="details">
                                    <p>
                                        <a href={`/tasks/${task.id}`} target="_blank" rel="noopener noreferrer">
                                            {task.title}
                                        </a>
                                    </p>
                                    <p>{task.description}</p>
                                    <p>Data Limite: {new Date(task.date).toLocaleDateString()}</p>
                                </div>
                                <div className="status">
                                    <i className={`fas fa-${task.status === 'completed' ? 'check-square' : 'square'}`}></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientDetails;
