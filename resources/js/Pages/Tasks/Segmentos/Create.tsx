import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/segmento.css';

const CreateSegmento = ({ auth }) => {
    const { data, setData, post, errors } = useForm({
        nome: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/segmentos');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Criar Segmento" />
            <div className="container">
                <h1>Criar Segmento</h1>
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
                        {errors.nome && <div className="error">{errors.nome}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateSegmento;
