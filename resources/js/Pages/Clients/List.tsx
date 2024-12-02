import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/list.css';
import { Inertia } from '@inertiajs/inertia';

interface Client {
    id: number;
    nome: string;
    email: string;
}

interface ClientDetails {
    contacts: string[];
    services: string[];
}

interface ProjectType {
    id: number;
    nome: string;
}

interface Segment {
    id: number;
    nome: string;
}

interface PageProps {
    clients: Client[];
    auth: {
        user: {
            name: string;
        };
    };
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    projectTypes: ProjectType[];
    segments: Segment[];
}

const ClientList: React.FC = () => {
    const { clients: initialClients, auth, links: initialLinks, projectTypes: initialProjectTypes, segments: initialSegments } = usePage<PageProps>().props;
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [links, setLinks] = useState(initialLinks);
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>(initialProjectTypes);
    const [segments, setSegments] = useState<Segment[]>(initialSegments);
    const [searchTerm, setSearchTerm] = useState('');
    const [projectType, setProjectType] = useState('');
    const [contact, setContact] = useState('');
    const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
    const [clientDetails, setClientDetails] = useState<{ [key: number]: ClientDetails }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({
        nome: '',
        razao_social: '',
        nome_fantasia: '',
        CNPJ: '',
        inscricao_estadual: '',
        segmento: '',
        melhor_dia_boleto: '',
        perfil_cliente: ''
    });

    useEffect(() => {
        let filtered = clients;

        if (searchTerm) {
            filtered = filtered.filter(client => client.nome && client.nome.includes(searchTerm));
        }

        if (projectType) {
            // Filter clients by project type
            filtered = filtered.filter(client => client.projectType === projectType);
        }

        if (contact) {
            // Filter clients by contact
        }

        setClients(filtered);
    }, [searchTerm, projectType, contact]);

    useEffect(() => {
        axios.get('/segments')
            .then(response => {
                setSegments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the segments!', error);
                setSegments([]); // Set segments to an empty array to avoid undefined error
            });
    }, []);

    const toggleClientDetails = (clientId: number) => {
        if (expandedClientId === clientId) {
            setExpandedClientId(null);
        } else {
            setExpandedClientId(clientId);
            if (!clientDetails[clientId]) {
                axios.get(`/clients/${clientId}/details`)
                    .then(response => {
                        setClientDetails({
                            ...clientDetails,
                            [clientId]: response.data
                        });
                    })
                    .catch(error => {
                        console.error('There was an error fetching the client details!', error);
                    });
            }
        }
    };

    const handleViewDetails = (clientId: number) => {
        Inertia.visit(`/clients/${clientId}`);
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            axios.get(url).then(response => {
                setClients(response.data.clients);
                setLinks(response.data.links);
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('/admin/clients', newClient)
            .then(response => {
                setClients([...clients, response.data]);
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('There was an error adding the client!', error);
            });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container">
                <h1>Listagem de Clientes</h1>
                <div className="filters">
                    <label>
                        Clientes:
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nome"
                        />
                    </label>
                    <label>
                        Tipo de Projetos:
                        <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                            <option value="">Todos</option>
                            {projectTypes.map((type) => (
                                <option key={type.id} value={type.nome}>{type.nome}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Contato:
                        <select value={contact} onChange={(e) => setContact(e.target.value)}>
                            <option value="">Todos</option>
                            {contacts.map((contact, index) => (
                                <option key={index} value={contact}>{contact}</option>
                            ))}
                        </select>
                    </label>
                    <button onClick={() => setIsModalOpen(true)} className="btn novo">Adicionar Novo Cliente</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nome do Cliente (Domínio)</th>
                            <th>Visualizar mais detalhes</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client: Client) => (
                            <React.Fragment key={client.id}>
                                <tr>
                                    <td>{client.nome}</td>
                                    <td>
                                        <button onClick={() => toggleClientDetails(client.id)}>
                                            {expandedClientId === client.id ? '-' : '+'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn detalhes" onClick={() => handleViewDetails(client.id)}>
                                            Página do Cliente
                                        </button>
                                    </td>
                                </tr>
                                {expandedClientId === client.id && clientDetails[client.id] && (
                                    <tr>
                                        <td colSpan={3}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Contatos</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <ul>
                                                                {clientDetails[client.id].contacts.map((contact, index) => (
                                                                    <li key={index}>{contact}</li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(link.url)}
                            disabled={!link.url}
                            className={link.active ? 'active' : ''}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                            <h2>Adicionar Novo Cliente</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Dominio:
                                    <input type="text" name="nome" value={newClient.nome} onChange={handleInputChange} required />
                                </label>
                                <label>
                                    Razão Social:
                                    <input type="text" name="razao_social" value={newClient.razao_social} onChange={handleInputChange} required />
                                </label>
                                <label>
                                    Nome Fantasia:
                                    <input type="text" name="nome_fantasia" value={newClient.nome_fantasia} onChange={handleInputChange} required />
                                </label>
                                <label>
                                    Cpf/CNPJ:
                                    <input type="text" name="CNPJ" value={newClient.CNPJ} onChange={handleInputChange} required />
                                </label>
                                <label>
                                    Inscrição Estadual:
                                    <input type="text" name="inscricao_estadual" value={newClient.inscricao_estadual} onChange={handleInputChange} required />
                                </label>
                                <label>
                                    Segmento:
                                    <select name="segmento" value={newClient.segmento} onChange={handleInputChange} required>
                                        <option value="">Selecione</option>
                                        {segments.map((segment) => (
                                            <option key={segment.id} value={segment.nome}>{segment.nome}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Melhor dia para o boleto:
                                    <select name="melhor_dia_boleto" value={newClient.melhor_dia_boleto} onChange={handleInputChange} required>
                                        <option value="">Selecione</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                        <option value="30">30</option>
                                    </select>
                                </label>
                                <label>
                                    Perfil do Cliente:
                                    <select name="perfil_cliente" value={newClient.perfil_cliente} onChange={handleInputChange} required>
                                        <option value="">Selecione</option>
                                        <option value="Conhecimento básico">Conhecimento básico</option>
                                        <option value="Conhecimento Intermediario">Conhecimento Intermediario</option>
                                        <option value="Conhecimento Avançado">Conhecimento Avançado</option>
                                        <option value="Aberto a novas idéias">Aberto a novas idéias</option>
                                        <option value="Exigente">Exigente</option>
                                        <option value="Pró-Ativo">Pró-Ativo</option>
                                        <option value="Indeciso/Confuso">Indeciso/Confuso</option>
                                    </select>
                                </label>
                                <button type="submit" className="btn">Salvar</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientList;
