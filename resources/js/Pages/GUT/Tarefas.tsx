import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import '../../../css/components/gutcss.css'; // Import the CSS file

const GUTTarefas = ({ arrTarefas }) => {
    const options = [0, 1, 2, 3, 4, 5];
    const debounceTimeout = useRef(null);

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

    const getInitialGUTValues = (priority) => {
        switch (priority) {
            case 'urgente':
                return { gravidade: 5, urgencia: 5, tendencia: 5 };
            case 'atencao':
                return { gravidade: 3, urgencia: 3, tendencia: 3 };
            case 'normal':
            default:
                return { gravidade: 0, urgencia: 0, tendencia: 0 };
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

    const handleChange = (id, setFunc, value, otherValues, setPontuacao, setPriority) => {
        setFunc(value);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            const newPontuacao = calculateP(...otherValues);
            setPontuacao(newPontuacao);
            const newPriority = getPriority(newPontuacao);
            setPriority(newPriority);
            atualizarPrioridade(id, newPriority);
        }, 500);
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
                    const initialValues = getInitialGUTValues(tarefa.priority);
                    const [gravidade, setGravidade] = useState(tarefa.gravidade ?? initialValues.gravidade);
                    const [urgencia, setUrgencia] = useState(tarefa.urgencia ?? initialValues.urgencia);
                    const [tendencia, setTendencia] = useState(tarefa.tendencia ?? initialValues.tendencia);
                    const [pontuacao, setPontuacao] = useState(calculateP(gravidade, urgencia, tendencia));
                    const [priority, setPriority] = useState(tarefa.priority ?? getPriority(pontuacao));

                    useEffect(() => {
                        const newPontuacao = calculateP(gravidade, urgencia, tendencia);
                        setPontuacao(newPontuacao);
                        setPriority(getPriority(newPontuacao));
                        console.log(`Tarefa ID: ${tarefa.id}, Gravidade: ${gravidade}, Urgência: ${urgencia}, Tendência: ${tendencia}, Pontuação: ${newPontuacao}, Prioridade: ${getPriority(newPontuacao)}`);
                    }, [gravidade, urgencia, tendencia]);

                    useEffect(() => {
                        const initialValues = getInitialGUTValues(tarefa.priority);
                        setGravidade(initialValues.gravidade);
                        setUrgencia(initialValues.urgencia);
                        setTendencia(initialValues.tendencia);
                        setPontuacao(calculateP(initialValues.gravidade, initialValues.urgencia, initialValues.tendencia));
                        console.log(`Tarefa ID: ${tarefa.id}, Prioridade Inicial: ${tarefa.priority}, Gravidade Inicial: ${initialValues.gravidade}, Urgência Inicial: ${initialValues.urgencia}, Tendência Inicial: ${initialValues.tendencia}`);
                    }, [tarefa.priority]);

                    return (
                        <tr key={tarefa.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <a href={`/backend/tarefa/editar/${tarefa.id}`} target="_blank" className="text-blue-600 hover:text-blue-800">
                                    {tarefa.title ? (tarefa.title.length >= 40 ? `${key + 1} - ${tarefa.title.substring(0, 40)}...` : `${key + 1} - ${tarefa.title}`) : 'Sem título'}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    className="border border-gray-300 rounded p-1"
                                    value={gravidade}
                                    onChange={(e) => handleChange(tarefa.id, setGravidade, Number(e.target.value), [Number(e.target.value), urgencia, tendencia], setPontuacao, setPriority)}
                                >
                                    {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    className="border border-gray-300 rounded p-1"
                                    value={urgencia}
                                    onChange={(e) => handleChange(tarefa.id, setUrgencia, Number(e.target.value), [gravidade, Number(e.target.value), tendencia], setPontuacao, setPriority)}
                                >
                                    {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    className="border border-gray-300 rounded p-1"
                                    value={tendencia}
                                    onChange={(e) => handleChange(tarefa.id, setTendencia, Number(e.target.value), [gravidade, urgencia, Number(e.target.value)], setPontuacao, setPriority)}
                                >
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
