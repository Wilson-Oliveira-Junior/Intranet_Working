import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/list.css';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface ClientDetails {
    contacts: string[];
    services: string[];
}

interface PageProps {
    clients: Client[];
    auth: {
        user: {
            name: string;
        };
    };
}

const ClientList: React.FC = () => {
    const { clients, auth } = usePage<PageProps>().props;
    const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
    const [searchTerm, setSearchTerm] = useState('');
    const [projectType, setProjectType] = useState('');
    const [contact, setContact] = useState('');
    const [projectTypes, setProjectTypes] = useState<string[]>([]);
    const [contacts, setContacts] = useState<string[]>([]);
    const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
    const [clientDetails, setClientDetails] = useState<{ [key: number]: ClientDetails }>({});

    useEffect(() => {
        // Fetch project types and contacts from the server
        // Assuming you have endpoints to fetch these data
        /*
        Inertia.get('/api/project-types', {}, {
            onSuccess: ({ props }) => setProjectTypes(props.projectTypes)
        });
        Inertia.get('/api/contacts', {}, {
            onSuccess: ({ props }) => setContacts(props.contacts)
        });
        */
    }, []);

    useEffect(() => {
        let filtered = clients;

        if (searchTerm) {
            filtered = filtered.filter(client => client.name.includes(searchTerm));
        }

        if (projectType) {
            // Filter clients by project type
            // Assuming you have a way to filter clients by project type
        }

        if (contact) {
            // Filter clients by contact
            // Assuming you have a way to filter clients by contact
        }

        setFilteredClients(filtered);
    }, [searchTerm, projectType, contact, clients]);

    const toggleClientDetails = (clientId: number) => {
        if (expandedClientId === clientId) {
            setExpandedClientId(null);
        } else {
            if (!clientDetails[clientId]) {
                // Fetch client details from the server
                // Assuming you have an endpoint to fetch client details
                Inertia.get(`/api/clients/${clientId}/details`, {}, {
                    onSuccess: ({ props }) => {
                        setClientDetails(prevDetails => ({
                            ...prevDetails,
                            [clientId]: props.details
                        }));
                        setExpandedClientId(clientId);
                    }
                });
            } else {
                setExpandedClientId(clientId);
            }
        }
    };

    const handleViewDetails = (clientId: number) => {
        Inertia.get(`/clients/${clientId}/details`);
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
                            {projectTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
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
                        {filteredClients.map((client: Client) => (
                            <React.Fragment key={client.id}>
                                <tr>
                                    <td>{client.name}</td>
                                    <td>
                                        <button onClick={() => toggleClientDetails(client.id)}>
                                            {expandedClientId === client.id ? '-' : '+'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => handleViewDetails(client.id)}>
                                            Ver Detalhes
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
                                                        <th>Serviços</th>
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
                                                        <td>
                                                            <ul>
                                                                {clientDetails[client.id].services.map((service, index) => (
                                                                    <li key={index}>{service}</li>
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
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientList;
