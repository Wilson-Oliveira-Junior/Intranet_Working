import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const FichasShow = ({ ficha }) => {
    const { post } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [approvalReason, setApprovalReason] = useState('');

    const handleApprove = () => {
        setShowModal(true);
    };

    const handleDeny = () => {
        post(`/fichas/${ficha.id}/deny`);
    };

    const submitApproval = () => {
        post(`/fichas/${ficha.id}/approve`, { reason: approvalReason });
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout>
            <h1>{ficha.nome}</h1>
            {/* Mostrar outros detalhes da ficha */}
            <button onClick={handleApprove}>Aprovar</button>
            <button onClick={handleDeny}>Negar</button>
            <Link href="/fichas">Voltar</Link>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Motivo da Aprovação</h2>
                        <textarea
                            value={approvalReason}
                            onChange={(e) => setApprovalReason(e.target.value)}
                            placeholder="Descreva o motivo da aprovação"
                        ></textarea>
                        <button onClick={submitApproval}>Enviar</button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default FichasShow;
