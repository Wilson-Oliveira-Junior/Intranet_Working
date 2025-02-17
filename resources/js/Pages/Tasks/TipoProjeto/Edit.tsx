import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/tipoProjeto.css';

const EditTipoProjeto = () => {
    const { tipoProjeto, csrf_token, auth } = usePage().props;
    const { data, setData, put, errors } = useForm({
        nome: tipoProjeto.nome || '',
        descricao: tipoProjeto.descricao || '',
        status: tipoProjeto.status || 'ativo',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/tipo-projeto/${tipoProjeto.id}`);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="tipo-projeto-container">
                <h1>Editar Tipo de Projeto</h1>
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
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                        {errors.status && <div className="text-danger">{errors.status}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                    <Link href="/tipo-projeto" className="btn btn-secondary">Cancelar</Link>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditTipoProjeto;
