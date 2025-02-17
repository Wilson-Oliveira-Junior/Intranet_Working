import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/segmento.css';

const EditSegmento = ({ auth, segmento }) => {
    const { data, setData, put, errors } = useForm({
        nome: segmento.nome || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/segmentos/${segmento.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Editar Segmento" />
            <div className="container">
                <h1>Editar Segmento</h1>
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

export default EditSegmento;
