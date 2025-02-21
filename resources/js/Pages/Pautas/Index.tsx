import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import '../../../css/components/pautas.css';

const PautasIndex = () => {
    const { pautas, auth, usuarios = [] } = usePage().props;
    const [activeTab, setActiveTab] = useState('paraMim');
    const [taskStatus, setTaskStatus] = useState('abertas');
    const [filteredPautas, setFilteredPautas] = useState([]);

    useEffect(() => {
        const newFilteredPautas = pautas.data.filter(pauta => {
            let matches = false;
            if (activeTab === 'paraMim') {
                matches = pauta.idresponsavel === auth.user.id && (taskStatus === 'abertas' ? pauta.status === 0 : pauta.status === 1);
            } else if (activeTab === 'queCriei') {
                matches = pauta.idcriadopor === auth.user.id && (taskStatus === 'abertas' ? pauta.status === 0 : pauta.status === 1);
            } else if (activeTab === 'compartilhadas') {
                matches = pauta.compartilhados && pauta.compartilhados.some(compartilhado => compartilhado.id_usuario === auth.user.id) && (taskStatus === 'abertas' ? pauta.status === 0 : pauta.status === 1);
            }
            return matches;
        });
        setFilteredPautas(newFilteredPautas);
    }, [pautas, activeTab, taskStatus, auth.user.id]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleStatusChange = (status) => {
        setTaskStatus(status);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handleFinalize = async (id) => {
        try {
            await axios.post(`/pautas/${id}/finalizar`);
            setFilteredPautas(filteredPautas.map(pauta =>
                pauta.id === id ? { ...pauta, status: 1 } : pauta
            ));
        } catch (error) {
            console.error('Erro ao finalizar pauta:', error);
        }
    };

    const formatUrgencia = (urgencia) => {
        switch (urgencia) {
            case 'imediatamente':
                return 'Tem que ser feito imediatamente!';
            case 'mesmo_dia':
                return 'Tem que ser feito no mesmo dia!';
            case 'data_estipulada':
                return 'Tem que ser feito até a data estipulada';
            case 'cronograma':
                return 'Encaixar no cronograma';
            default:
                return urgencia;
        }
    };

    const getUserName = (userId) => {
        const user = usuarios.find(usuario => usuario.id === userId);
        return user ? user.name : 'Desconhecido';
    };

    return (
        <AuthenticatedLayout>
            <div className="pautas-container">
                <h1 className="pautas-title">Pautas</h1>
                <div className="pautas-create-button">
                    <Link href="/pautas/create" className="pautas-btn pautas-btn-primary">Criar Nova Pauta</Link>
                </div>
                <div className="pautas-tabs">
                    <button
                        className={`pautas-tab-button ${activeTab === 'paraMim' ? 'active' : ''}`}
                        onClick={() => handleTabChange('paraMim')}
                    >
                        Para mim
                    </button>
                    <button
                        className={`pautas-tab-button ${activeTab === 'queCriei' ? 'active' : ''}`}
                        onClick={() => handleTabChange('queCriei')}
                    >
                        Que criei
                    </button>
                    <button
                        className={`pautas-tab-button ${activeTab === 'compartilhadas' ? 'active' : ''}`}
                        onClick={() => handleTabChange('compartilhadas')}
                    >
                        Compartilhadas
                    </button>
                </div>
                <div className="pautas-status-buttons">
                    <button
                        className={`pautas-btn ${taskStatus === 'abertas' ? 'pautas-btn-primary' : 'pautas-btn-secondary'}`}
                        onClick={() => handleStatusChange('abertas')}
                    >
                        Abertas
                    </button>
                    <button
                        className={`pautas-btn ${taskStatus === 'fechadas' ? 'pautas-btn-primary' : 'pautas-btn-secondary'}`}
                        onClick={() => handleStatusChange('fechadas')}
                    >
                        Fechadas
                    </button>
                </div>
                <div className="pautas-list">
                    {filteredPautas.length > 0 ? (
                        filteredPautas.map(pauta => (
                            <div key={pauta.id} className="pautas-item">
                                <div className="pautas-column">
                                    <p>ID: {pauta.id}</p>
                                    <p>Título: {pauta.titulo}</p>
                                    <p>Urgência: {formatUrgencia(pauta.idUrgencia)}</p>
                                    <p>Criador: {getUserName(pauta.idcriadopor)}</p>
                                </div>
                                <div className="pautas-column">
                                    <p>Data Desejada: {formatDate(pauta.data_desejada)}</p>
                                    {pauta.status === 0 && (
                                        <p>Status: Aberta</p>
                                    )}
                                    {pauta.status === 1 && (
                                        <p>Status: Fechada</p>
                                    )}
                                </div>
                                <div className="pautas-column">
                                    <Link href={`/pautas/${pauta.id}/edit`} className="pautas-btn pautas-btn-primary">Ver Detalhes</Link>
                                    {pauta.status === 0 && (
                                        <button onClick={() => handleFinalize(pauta.id)} className="pautas-btn pautas-btn-secondary">Finalizar</button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma pauta encontrada.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PautasIndex;
