import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/pages/MeuCronograma.css";

const MeuCronograma = () => {
    const { schedules } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="meu-cronograma-container">
                <h1 className="meu-cronograma-title">Meu Cronograma</h1>
                <table className="meu-cronograma-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => (
                            <tr key={schedule.id} className="meu-cronograma-row">
                                <td>{schedule.title}</td>
                                <td>{schedule.date}</td>
                                <td>{schedule.description}</td>
                                <td>
                                    <Link
                                        href={`/tasks/${schedule.id}`}
                                        className="meu-cronograma-button"
                                    >
                                        Ver Tarefa
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default MeuCronograma;
