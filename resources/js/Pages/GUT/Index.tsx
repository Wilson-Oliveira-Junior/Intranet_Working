import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GUTTarefas from './Tarefas';
import '../../../css/components/gutcss.css';

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
    const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null);
    const [gravidade, setGravidade] = useState(0);
    const [urgencia, setUrgencia] = useState(0);
    const [tendencia, setTendencia] = useState(0);
    const [pontuacao, setPontuacao] = useState(0);

    useEffect(() => {
        if (selectedTarefa) {
            setGravidade(selectedTarefa.gravidade);
            setUrgencia(selectedTarefa.urgencia);
            setTendencia(selectedTarefa.tendencia);
            setPontuacao(selectedTarefa.tarefa_ordem);
        }
    }, [selectedTarefa]);

    const fetchTarefas = async (sector_id: number) => {
        console.log(`Fetching tasks for sector ID: ${sector_id}`);
        try {
            if (selectedTarefa) {
                await axios.post(`/GUT/tarefas/${selectedTarefa.id}/atualizar-prioridade`, {
                    idtarefa: selectedTarefa.id,
                    gravidade,
                    urgencia,
                    tendencia,
                    pontuacao,
                });
            }

            const response = await axios.get(`/GUT/tarefas/${sector_id}`);
            const { arrTarefas } = response.data;
            setTarefas(arrTarefas);
            setWarning(null);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            setWarning('Erro ao buscar tarefas');
        }
    };

    const handleEquipeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newEquipeId = Number(event.target.value);
        console.log(`Equipe changed to: ${newEquipeId}`);
        setSelectedEquipe(newEquipeId);
    };

    const handleUpdateList = () => {
        fetchTarefas(selectedEquipe);
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
                            <button onClick={handleUpdateList} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
