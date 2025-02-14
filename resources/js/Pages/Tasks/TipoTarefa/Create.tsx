import React from 'react';
import { useForm } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/tipoTarefa.css';

const Create = () => {
    const { data, setData, post, errors } = useForm({
        nome: '',
        descricao: '',
        status: 'Ativo',
        estimativa: '', // Adicionar campo de estimativa
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/tipo-tarefa');
    };

    return (
        <AuthenticatedLayout>
            <div>
                <h1>Criar Tipo de Tarefa</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            value={data.nome}
                            onChange={(e) => setData('nome', e.target.value)}
                            className="form-control"
                        />
                        {errors.nome && <div className="text-danger">{errors.nome}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição</label>
                        <input
                            type="text"
                            id="descricao"
                            value={data.descricao}
                            onChange={(e) => setData('descricao', e.target.value)}
                            className="form-control"
                        />
                        {errors.descricao && <div className="text-danger">{errors.descricao}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="form-control"
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                        {errors.status && <div className="text-danger">{errors.status}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="estimativa">Estimativa</label>
                        <input
                            type="number"
                            id="estimativa"
                            value={data.estimativa}
                            onChange={(e) => setData('estimativa', e.target.value)}
                            className="form-control"
                        />
                        {errors.estimativa && <div className="text-danger">{errors.estimativa}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
