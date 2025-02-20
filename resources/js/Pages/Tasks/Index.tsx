import React from 'react';
import { Head } from '@inertiajs/react';

const Index = ({ user, teams, tasks, clients, tiposTarefa }) => {
    return (
        <div>
            <Head title="Tarefas" />
            <h1>Tarefas</h1>
            {/* Renderize os dados das tarefas aqui */}
        </div>
    );
};

export default Index;
