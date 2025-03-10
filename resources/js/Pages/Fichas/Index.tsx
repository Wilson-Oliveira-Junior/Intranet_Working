import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/components/fichas.css";

const FichasIndex = ({ fichas }) => {
    const handleApprove = (id) => {
        // Lógica para aprovar a ficha
    };

    const handleDeny = (id) => {
        // Lógica para negar a ficha
    };

    return (
        <AuthenticatedLayout>
            <h1>Fichas</h1>
            <Link href="/fichas/create" className="btn btn-primary">Nova Ficha</Link>
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {fichas.map(ficha => (
                        <tr key={ficha.id}>
                            <td>{ficha.id}</td>
                            <td>{ficha.nome}</td>
                            <td>{ficha.status}</td>
                            <td>
                                <Link href={`/fichas/${ficha.id}`} className="btn btn-info btn-sm">Ver</Link>
                                {ficha.status === 'Aguardando Aprovação' && (
                                    <>
                                        <button onClick={() => handleApprove(ficha.id)} className="btn btn-success btn-sm ml-2">Aprovar</button>
                                        <button onClick={() => handleDeny(ficha.id)} className="btn btn-danger btn-sm ml-2">Negar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AuthenticatedLayout>
    );
};

export default FichasIndex;
