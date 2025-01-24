import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import '../../../css/components/gutcss.css'; // Import the CSS file

const GUTTarefas = ({ arrTarefas }) => {
    const options = [0, 1, 2, 3, 4, 5];

    const calculateP = (g, u, t) => {
        const gravidade = Number(g);
        const urgencia = Number(u);
        const tendencia = Number(t);
        return gravidade * urgencia * tendencia;
    };

    const getPriority = (pontuacao) => {
        if (pontuacao <= 50) {
            return 'normal';
        } else if (pontuacao <= 100) {
            return 'atencao';
        } else {
            return 'urgente';
        }
    };

    const atualizarPrioridade = (id, priority) => {
        Inertia.post(`/GUT/tarefas/${id}/atualizar-prioridade`, { priority }, {
            onSuccess: (page) => {
                console.log('Prioridade atualizada com sucesso', page.props.message);
            },
            onError: (errors) => {
                console.error('Erro ao atualizar prioridade:', errors);
            }
        });
    };

    return (
        <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TAREFA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">G</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">U</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATA TAREFA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATA DESEJADA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESPONSÁVEL</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {arrTarefas.map((tarefa, key) => {
                    const [gravidade, setGravidade] = useState(tarefa.gravidade || 0);
                    const [urgencia, setUrgencia] = useState(tarefa.urgencia || 0);
                    const [tendencia, setTendencia] = useState(tarefa.tendencia || 0);
                    const [pontuacao, setPontuacao] = useState(calculateP(tarefa.gravidade, tarefa.urgencia, tarefa.tendencia));
                    const [priority, setPriority] = useState(getPriority(pontuacao));

                    useEffect(() => {
                        const newPontuacao = calculateP(gravidade, urgencia, tendencia);
                        setPontuacao(newPontuacao);
                        const newPriority = getPriority(newPontuacao);
                        if (newPriority !== priority) {
                            setPriority(newPriority);
                            atualizarPrioridade(tarefa.id, newPriority);
                        }
                    }, [gravidade, urgencia, tendencia]);

                    return (
                        <tr key={tarefa.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <a href={`/backend/tarefa/editar/${tarefa.id}`} target="_blank" className="text-blue-600 hover:text-blue-800">
                                    {tarefa.title ? (tarefa.title.length >= 40 ? `${key + 1} - ${tarefa.title.substring(0, 40)}...` : `${key + 1} - ${tarefa.title}`) : 'Sem título'}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select className="border border-gray-300 rounded p-1" value={gravidade} onChange={(e) => setGravidade(Number(e.target.value))}>
                                    {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select className="border border-gray-300 rounded p-1" value={urgencia} onChange={(e) => setUrgencia(Number(e.target.value))}>
                                    {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select className="border border-gray-300 rounded p-1" value={tendencia} onChange={(e) => setTendencia(Number(e.target.value))}>
                                    {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{isNaN(pontuacao) ? 'N/A' : pontuacao}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(tarefa.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                <input type="text" className="border border-gray-300 rounded p-1 w-24" placeholder="dd/mm/aaaa" defaultValue={tarefa.data_desejada ? new Date(tarefa.data_desejada).toLocaleDateString() : ''} />
                                <i className="fas fa-sync-alt ml-2 text-gray-500"></i>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{tarefa.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tarefa.responsavel ? tarefa.responsavel.name : 'Backlog'}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default GUTTarefas;
