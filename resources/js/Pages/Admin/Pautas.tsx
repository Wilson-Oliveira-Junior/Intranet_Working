import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Pautas() {
    const { pautas } = usePage().props;

    return (
        <div>
            <h1>Pautas</h1>
            <ul>
                {pautas.map((pauta) => (
                    <li key={pauta.id}>{pauta.titulo}</li>
                ))}
            </ul>
        </div>
    );
}
