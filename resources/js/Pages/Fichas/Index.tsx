import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/components/fichas.css";

const FichasIndex = ({ fichas }) => {
    const [selectedFicha, setSelectedFicha] = useState(null);
    const [observacao, setObservacao] = useState('');

    const handleApprove = (id) => {
        // Lógica para aprovar a ficha
    };

    const handleDeny = (id) => {
        if (!observacao) {
            alert('A observação é obrigatória para rejeitar a ficha.');
            return;
        }
        // Enviar requisição para rejeitar a ficha
        fetch(`/fichas/${id}/deny`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ observacao_rejeicao: observacao }),
        }).then(() => window.location.reload());
    };

    return (
        <AuthenticatedLayout>
            <h1 className="text-center mb-4">Fichas</h1>
            <div className="d-flex justify-content-end mb-3">
                <Link href="/fichas/create" className="btn btn-primary">Nova Ficha</Link>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-bordered text-center align-middle">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Criado por</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fichas.map(ficha => (
                            <tr key={ficha.id}>
                                <td>{ficha.id}</td>
                                <td>{ficha.nome}</td>
                                <td>{ficha.user?.name || 'N/A'}</td> {/* Exibe o nome do criador */}
                                <td>
                                    <span className={`badge ${ficha.status === 'Autorizada' ? 'badge-success' : ficha.status === 'Reprovada' ? 'badge-danger' : 'badge-warning'}`}>
                                        {ficha.status}
                                    </span>
                                </td>
                                <td>
                                    <Link href={`/fichas/${ficha.id}`} className="btn btn-info btn-sm mr-2">Ver</Link>
                                    {ficha.status === 'Aguardando Aprovação' && (
                                        <>
                                            <button onClick={() => handleApprove(ficha.id)} className="btn btn-success btn-sm mr-2">Aprovar</button>
                                            <button onClick={() => setSelectedFicha(ficha)} className="btn btn-danger btn-sm">Negar</button>
                                        </>
                                    )}
                                    {ficha.isEditable && (
                                        <Link href={`/fichas/${ficha.id}/edit`} className="btn btn-warning btn-sm ml-2">Editar</Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedFicha && (
                <div className="modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rejeitar Ficha</h5>
                                <button type="button" className="close" onClick={() => setSelectedFicha(null)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control"
                                    placeholder="Digite a observação"
                                    value={observacao}
                                    onChange={e => setObservacao(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => handleDeny(selectedFicha.id)} className="btn btn-danger">Confirmar Rejeição</button>
                                <button onClick={() => setSelectedFicha(null)} className="btn btn-secondary">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default FichasIndex;
