import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GUTTarefas from './Tarefas';
import '../../../css/components/gutcss.css'; // Import the CSS file

interface Equipe {
    id: number;
    nome: string;
}

interface Setor {
    id: number;
    nome: string;
}

interface Tarefa {
    id: number;
    titulo: string;
    gravidade: number;
    urgencia: number;
    tendencia: number;
    tarefa_ordem: number;
    created_at: string;
    data_desejada?: string;
    statusTarefa: {
        nome: string;
    };
    responsavel?: {
        name: string;
    };
}

interface GUTIndexProps {
    equipe: Equipe | null;
    setores: Setor[];
    arrTarefas?: Tarefa[];
}

const GUTIndex: React.FC<GUTIndexProps> = ({ equipe, setores, arrTarefas = [] }) => {
    if (!equipe) {
        console.error('Equipe data is null');
        return <div>Loading...</div>;
    }

    console.log('Equipe data:', equipe);
    console.log('Setores data:', setores);

    const [selectedEquipe, setSelectedEquipe] = useState(equipe.id);
    const [tarefas, setTarefas] = useState<Tarefa[]>(arrTarefas);
    const [warning, setWarning] = useState<string | null>(null);

    const fetchTarefas = (sector_id: number) => {
        console.log(`Fetching tasks for sector ID: ${sector_id}`);
        Inertia.visit(`/GUT/tarefas/${sector_id}`, {
            method: 'get',
            onSuccess: (page) => {
                if (page.props.arrTarefas && page.props.arrTarefas.length > 0) {
                    console.log('Tasks fetched successfully:', page.props.arrTarefas);
                    setTarefas(page.props.arrTarefas as Tarefa[]);
                    setWarning(null);
                } else {
                    console.error('No tasks found for the specified criteria.');
                    setTarefas([]);
                    setWarning('Sem tarefas para esse setor');
                }
            },
            onError: (errors) => {
                console.error('Error fetching tasks:', errors);
                setWarning('Erro ao buscar tarefas');
            }
        });
    };

    const handleEquipeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newEquipeId = Number(event.target.value);
        console.log(`Equipe changed to: ${newEquipeId}`);
        setSelectedEquipe(newEquipeId);
        fetchTarefas(newEquipeId);
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto p-4">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="text-2xl font-bold mb-4">GUT - Matriz de Priorização</h1>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <select value={selectedEquipe} onChange={handleEquipeChange} className="border border-gray-300 rounded p-2 mr-4">
                                    <option value="0">Qual equipe deseja ver o GUT?</option>
                                    {setores.map((setor) => (
                                        <option key={setor.id} value={setor.id}>{setor.name}</option>
                                    ))}
                                </select>
                                <div>
                                    Você está visualizando a área de: <strong>{equipe.name}</strong>
                                </div>
                            </div>
                            <button onClick={() => fetchTarefas(selectedEquipe)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Atualizar Listagem
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {warning ? (
                            <div className="text-center text-gray-500">{warning}</div>
                        ) : (
                            <GUTTarefas arrTarefas={tarefas} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default GUTIndex;
