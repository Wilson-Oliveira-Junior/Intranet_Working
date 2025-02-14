import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/tipoTarefa.css';

const Edit = () => {
    const { tipoTarefa } = usePage().props;
    const [nome, setNome] = useState(tipoTarefa.nome);
    const [status, setStatus] = useState(tipoTarefa.status);
    const [estimativa, setEstimativa] = useState(tipoTarefa.estimativa ? tipoTarefa.estimativa.slice(0, 5) : '');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`/tipo-tarefa/${tipoTarefa.id}`, {
                nome,
                status,
                estimativa: estimativa ? `${estimativa}:00` : null,
            });
            alert('Tipo de Tarefa atualizado com sucesso');
            window.location.href = '/tipo-tarefa';
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Erro ao atualizar o Tipo de Tarefa:', error);
            }
        }
    };

    const handleCancel = () => {
        window.location.href = '/tipo-tarefa';
    };

    return (
        <AuthenticatedLayout>
            <div className="container">
                <h1>Editar Tipo de Tarefa</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            className="form-control"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        {errors.nome && <div className="error">{errors.nome}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                        {errors.status && <div className="error">{errors.status}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="estimativa">Estimativa</label>
                        <input
                            type="time"
                            id="estimativa"
                            className="form-control"
                            value={estimativa}
                            onChange={(e) => setEstimativa(e.target.value)}
                        />
                        {errors.estimativa && <div className="error">{errors.estimativa}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
