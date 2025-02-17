import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/segmento.css';

const SegmentoCliente = ({ auth }) => {
    const { csrf_token } = usePage().props;
    const [segmentos, setSegmentos] = useState([]);
    const [paginationLinks, setPaginationLinks] = useState([]);

    const fetchSegmentos = async (url = '/api/segmentos') => {
        try {
            const response = await axios.get(url);
            setSegmentos(response.data.data);
            setPaginationLinks(response.data.links);
        } catch (error) {
            console.error('Erro ao buscar segmentos:', error);
        }
    };

    useEffect(() => {
        fetchSegmentos();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar este segmento?')) {
            try {
                await axios.delete(`/segmentos/${id}`, {
                    headers: {
                        'X-CSRF-TOKEN': csrf_token,
                    },
                });

                fetchSegmentos();
            } catch (error) {
                console.error('Erro ao deletar o segmento:', error);
            }
        }
    };

    const handlePageChange = (url) => {
        fetchSegmentos(url);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Segmentos Clientes" />
            <div className="container">
                <h1>Segmentos Clientes</h1>
                <Link href="/segmentos/create" className="btn btn-primary">Criar um novo Segmento</Link>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {segmentos.map(segmento => (
                            <tr key={segmento.id}>
                                <td>{segmento.id}</td>
                                <td>{segmento.nome}</td>
                                <td>
                                    <Link href={`/segmentos/${segmento.id}/edit`} className="btn btn-warning">Editar</Link>
                                    <button onClick={() => handleDelete(segmento.id)} className="btn btn-danger">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.isArray(paginationLinks) && paginationLinks.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(link.url)}
                            disabled={!link.url}
                            className={`btn ${link.active ? 'active' : ''}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SegmentoCliente;
