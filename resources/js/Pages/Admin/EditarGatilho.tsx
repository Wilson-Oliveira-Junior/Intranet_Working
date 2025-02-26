import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const EditarGatilho: React.FC<{ gatilho: any }> = ({ gatilho }) => {
    const { data, setData, put, errors } = useForm({
        gatilho: gatilho.gatilho || '',
        id_tipo_projeto: gatilho.id_tipo_projeto || '',
        tipo_gatilho: gatilho.tipo_gatilho || '',
        dias_limite_padrao: gatilho.dias_limite_padrao || '',
        dias_limite_50: gatilho.dias_limite_50 || '',
        dias_limite_40: gatilho.dias_limite_40 || '',
        dias_limite_30: gatilho.dias_limite_30 || '',
        id_referente: gatilho.id_referente || '',
        id_grupo_gatilho: gatilho.id_grupo_gatilho || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('gatilhos.atualizar', gatilho.id));
    };

    return (
        <AuthenticatedLayout>
            <div className="container">
                <h1>Editar Gatilho</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Status</label>
                        <input type="text" className="form-control" value={data.gatilho} onChange={e => setData('gatilho', e.target.value)} />
                        {errors.gatilho && <div className="text-danger">{errors.gatilho}</div>}
                    </div>
                    <div className="form-group">
                        <label>Cliente</label>
                        <input type="text" className="form-control" value={data.id_tipo_projeto} onChange={e => setData('id_tipo_projeto', e.target.value)} />
                        {errors.id_tipo_projeto && <div className="text-danger">{errors.id_tipo_projeto}</div>}
                    </div>
                    <div className="form-group">
                        <label>Tipo de Projeto</label>
                        <input type="text" className="form-control" value={data.tipo_gatilho} onChange={e => setData('tipo_gatilho', e.target.value)} />
                        {errors.tipo_gatilho && <div className="text-danger">{errors.tipo_gatilho}</div>}
                    </div>
                    <div className="form-group">
                        <label>Finalizados</label>
                        <input type="text" className="form-control" value={data.dias_limite_padrao} onChange={e => setData('dias_limite_padrao', e.target.value)} />
                        {errors.dias_limite_padrao && <div className="text-danger">{errors.dias_limite_padrao}</div>}
                    </div>
                    <div className="form-group">
                        <label>Total</label>
                        <input type="text" className="form-control" value={data.dias_limite_50} onChange={e => setData('dias_limite_50', e.target.value)} />
                        {errors.dias_limite_50 && <div className="text-danger">{errors.dias_limite_50}</div>}
                    </div>
                    <div className="form-group">
                        <label>Processo</label>
                        <input type="text" className="form-control" value={data.dias_limite_40} onChange={e => setData('dias_limite_40', e.target.value)} />
                        {errors.dias_limite_40 && <div className="text-danger">{errors.dias_limite_40}</div>}
                    </div>
                    <div className="form-group">
                        <label>Ação</label>
                        <input type="text" className="form-control" value={data.dias_limite_30} onChange={e => setData('dias_limite_30', e.target.value)} />
                        {errors.dias_limite_30 && <div className="text-danger">{errors.dias_limite_30}</div>}
                    </div>
                    <div className="form-group">
                        <label>Referente</label>
                        <input type="text" className="form-control" value={data.id_referente} onChange={e => setData('id_referente', e.target.value)} />
                        {errors.id_referente && <div className="text-danger">{errors.id_referente}</div>}
                    </div>
                    <div className="form-group">
                        <label>Grupo de Gatilho</label>
                        <input type="text" className="form-control" value={data.id_grupo_gatilho} onChange={e => setData('id_grupo_gatilho', e.target.value)} />
                        {errors.id_grupo_gatilho && <div className="text-danger">{errors.id_grupo_gatilho}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditarGatilho;
