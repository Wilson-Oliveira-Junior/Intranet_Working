import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/tipoProjeto.css';

const TipoProjetoIndex = () => {
    const { tiposProjeto: initialTiposProjeto, links: initialLinks, csrf_token, auth } = usePage().props;
    const [tiposProjeto, setTiposProjeto] = useState(initialTiposProjeto);
    const [links, setLinks] = useState(initialLinks);

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';

        try {
            await axios.put(`/tipo-projeto/${id}/status`, { status: newStatus }, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
            });

            const updatedTiposProjeto = tiposProjeto.data.map((tipoProjeto) => {
                if (tipoProjeto.id === id) {
                    return { ...tipoProjeto, status: newStatus };
                }
                return tipoProjeto;
            });

            setTiposProjeto({ ...tiposProjeto, data: updatedTiposProjeto });
        } catch (error) {
            console.error('Erro ao atualizar o status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar este tipo de projeto?')) {
            try {
                await axios.delete(`/tipo-projeto/${id}`, {
                    headers: {
                        'X-CSRF-TOKEN': csrf_token,
                    },
                });

                const updatedTiposProjeto = tiposProjeto.data.filter((tipoProjeto) => tipoProjeto.id !== id);
                setTiposProjeto({ ...tiposProjeto, data: updatedTiposProjeto });
            } catch (error) {
                console.error('Erro ao deletar o tipo de projeto:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="tipo-projeto-container">
                <h1>Tipos de Projeto</h1>
                <Link href="/tipo-projeto/create" className="btn btn-primary">Criar Novo Tipo de Projeto</Link>
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
                        {tiposProjeto.data.map((tipoProjeto) => (
                            <tr key={tipoProjeto.id}>
                                <td>{tipoProjeto.id}</td>
                                <td>{tipoProjeto.nome}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={tipoProjeto.status === 'ativo'}
                                            onChange={(event) => {
                                                event.preventDefault();
                                                handleStatusChange(tipoProjeto.id, tipoProjeto.status);
                                            }}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <Link href={`/tipo-projeto/${tipoProjeto.id}/edit`} className="btn btn-warning">Editar</Link>
                                    <button onClick={() => handleDelete(tipoProjeto.id)} className="btn btn-danger">Deletar</button>
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

export default TipoProjetoIndex;
