import React from 'react';
import { usePage } from '@inertiajs/react';

const ShowPauta: React.FC = () => {
    const { pauta } = usePage().props;

    return (
        <div>
            <h1>{pauta.titulo}</h1>
            <p>{pauta.descricao}</p>
            {/* Adicione outros detalhes da pauta conforme necessário */}
        </div>
    );
};

export default ShowPauta;
