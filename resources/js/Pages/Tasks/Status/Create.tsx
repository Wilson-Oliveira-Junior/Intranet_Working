import React from 'react';
import { useForm, Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../../css/pages/status.css';

const StatusCreate = ({ auth }) => {
    const { csrf_token } = usePage().props;
    const { data, setData, post, errors } = useForm({
        name: '',
        description: '',
        status: 'Ativo',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/status', {
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Criar Status" />
            <div className="container">
                <h1>Criar um novo Status</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="form-control" />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="form-control"></textarea>
                        {errors.description && <div className="text-danger">{errors.description}</div>}
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="form-control">
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                        {errors.status && <div className="text-danger">{errors.status}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Criar</button>
                    <Link href="/status" className="btn btn-secondary">Cancelar</Link>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default StatusCreate;
