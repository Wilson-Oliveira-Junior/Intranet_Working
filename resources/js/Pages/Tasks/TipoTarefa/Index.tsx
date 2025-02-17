import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/tipoTarefa.css';

const Index = () => {
    const { tiposTarefa: initialTiposTarefa, links: initialLinks, csrf_token } = usePage().props;
    const [tiposTarefa, setTiposTarefa] = useState(initialTiposTarefa);
    const [links, setLinks] = useState(initialLinks);

    // Função para alterar o status
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';

        // Envia a requisição para o backend
        try {
            await axios.put(`/tipo-tarefa/${id}/status`, { status: newStatus }, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
            })
                .then(() => {
                    // Atualiza o estado local após a resposta do servidor
                    const updatedTiposTarefa = tiposTarefa.data.map((tipo) => {
                        if (tipo.id === id) {
                            return { ...tipo, status: newStatus };
                        }
                        return tipo;
                    });
                    setTiposTarefa({ ...tiposTarefa, data: updatedTiposTarefa });
                })
                .catch(error => {
                    console.error('Erro ao atualizar o status:', error);
                });
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    // Função para deletar um tipo de tarefa
    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar este tipo de tarefa?')) {
            try {
                await axios.delete(`/tipo-tarefa/${id}`, {
                    headers: {
                        'X-CSRF-TOKEN': csrf_token,
                    },
                })
                    .then(() => {
                        console.log('Tipo de tarefa deletado com sucesso');
                        // Atualiza o estado local removendo o item deletado
                        const updatedTiposTarefa = tiposTarefa.data.filter((tipo) => tipo.id !== id);
                        setTiposTarefa({ ...tiposTarefa, data: updatedTiposTarefa });
                    })
                    .catch(error => {
                        console.error('Erro ao deletar o tipo de tarefa:', error);
                    });
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    };

    // Função para mudar a página
    const handlePageChange = async (url) => {
        try {
            const response = await axios.get(url);
            setTiposTarefa(response.data.tiposTarefa);
            setLinks(response.data.links);
        } catch (error) {
            console.error('Erro ao mudar de página:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container">
                <h1>Tipos de Tarefa</h1>
                <div className="filters">
                    <Link href="/tipo-tarefa/create" className="btn btn-primary novo">Criar Novo Tipo de Tarefa</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposTarefa.data.map((tipo) => (
                            <tr key={tipo.id}>
                                <td>{tipo.id}</td>
                                <td>{tipo.nome}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={tipo.status === 'Ativo'}
                                            onChange={(event) => {
                                                event.preventDefault(); // Impede o comportamento padrão
                                                handleStatusChange(tipo.id, tipo.status);
                                            }}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <Link href={`/tipo-tarefa/${tipo.id}/edit`} className="btn btn-warning">Editar</Link>
                                    <button
                                        onClick={() => handleDelete(tipo.id)}
                                        className="btn btn-danger"
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination" dangerouslySetInnerHTML={{ __html: links }} />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
