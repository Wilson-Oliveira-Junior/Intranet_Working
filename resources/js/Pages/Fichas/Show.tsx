import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const FichasShow = ({ ficha }) => {
    const { post } = useForm();

    const handleApprove = () => {
        post(`/fichas/${ficha.id}/approve`);
    };

    const handleDeny = () => {
        post(`/fichas/${ficha.id}/deny`);
    };

    return (
        <AuthenticatedLayout>
            <h1>{ficha.nome}</h1>
            {/* Mostrar outros detalhes da ficha */}
            <button onClick={handleApprove}>Aprovar</button>
            <button onClick={handleDeny}>Negar</button>
            <Link href="/fichas">Voltar</Link>
        </AuthenticatedLayout>
    );
};

export default FichasShow;
