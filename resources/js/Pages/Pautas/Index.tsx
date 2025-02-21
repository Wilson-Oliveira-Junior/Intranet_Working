import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const PautasIndex = () => {
    const { pautas } = usePage().props;

    return (
        <div>
            <h1>Pautas</h1>
            <Link href="/pautas/create" className="btn btn-primary">Criar Nova Pauta</Link>
            <ul>
                {pautas.data.map((pauta, index) => (
                    <li key={index}>
                        <Link href={`/pautas/${pauta.id}/edit`}>{pauta.titulo}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PautasIndex;
