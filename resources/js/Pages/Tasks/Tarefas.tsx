import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import '../../../css/components/tarefas.css';
import TaskResponseModal from '../TeamSchedule/TaskResponseModal';

const Tarefas = ({ user, teams, tasks, clients, tiposTarefa, users }) => {
    const [activeTab, setActiveTab] = useState('paraMim');
    const [selectedTeam, setSelectedTeam] = useState(user?.sector_id || '');
    const [taskStatus, setTaskStatus] = useState('abertas');
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [taskComments, setTaskComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [elapsedTime, setElapsedTime] = useState({});
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        if (!user || !teams) {
            console.error('User or teams data is missing');
        }
        console.log('Tasks:', tasks);
    }, [user, teams, tasks]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newElapsedTime = {};
            tasks.forEach(task => {
                if (task.status === 'trabalhando' && task.start_time) {
                    const startTime = new Date(task.start_time);
                    const now = new Date();
                    const elapsed = Math.floor((now - startTime) / 1000);
                    newElapsedTime[task.id] = elapsed;
                }
            });
            setElapsedTime(newElapsedTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [tasks]);

    useEffect(() => {
        const newFilteredTasks = tasks.filter(task => {
            let matches = false;
            if (activeTab === 'paraMim') {
                matches = task.user_id === user.id && (taskStatus === 'aberto' ? (task.status === 'aberto' || task.status === 'trabalhando') : task.status === 'fechado');
            } else if (activeTab === 'queCriei') {
                matches = task.creator_id === user.id && (taskStatus === 'aberto' ? (task.status === 'aberto' || task.status === 'trabalhando') : task.status === 'fechado');
            } else if (activeTab === 'queEuSigo') {
                matches = task.followers && task.followers.some(follower => follower.id === user.id) && (taskStatus === 'aberto' ? (task.status === 'aberto' || task.status === 'trabalhando') : task.status === 'fechado');
            } else if (activeTab === 'backlog') {
                matches = task.sector_id === parseInt(selectedTeam);
            }
            return matches;
        });
        setFilteredTasks(newFilteredTasks);
    }, [tasks, activeTab, taskStatus, user.id, selectedTeam]);

    const formatElapsedTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}h ${mins}m ${secs}s`;
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    const handleStatusChange = (status) => {
        setTaskStatus(status);
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setTaskComments(task.comments || []);
        setAttachments(task.attachments || []);
        setFollowers(task.followers || []);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedTask(null);
        setTaskComments([]);
        setAttachments([]);
        setFollowers([]);
    };

    const handleAddComment = (comment) => {
        setTaskComments((prevComments) => [...prevComments, comment]);
    };

    const handleReopenTask = async (task) => {
        try {
            const response = await fetch(`/tasks/${task.id}/reopen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            if (response.ok) {
                task.status = 'aberto';
                setTaskStatus('aberto');
                console.log('Task reopened successfully');
            } else {
                console.error('Failed to reopen task:', await response.json());
            }
        } catch (error) {
            console.error('Error reopening task:', error);
        }
    };

    const handleStartTask = async (task) => {
        try {
            const response = await fetch(`/tasks/${task.id}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            if (response.ok) {
                task.status = 'trabalhando';
                task.start_time = new Date().toISOString();
                setTaskStatus('trabalhando');
            } else {
                const errorData = await response.json();
            }
        } catch (error) {
            console.error('Error starting task:', error);
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            const response = await fetch(`/tasks/${task.id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ hours_worked: Math.floor((elapsedTime[task.id] || 0) / 3600) }),
            });

            if (response.ok) {
                task.status = 'fechadas';
                setTaskStatus('fechadas');
            } else {
                console.error('Failed to complete task:', await response.json());
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    if (!user || !teams) {
        return <div>Loading...</div>;
    }

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <Head title="Tarefas" />
                <h1>Tarefas</h1>
                <div className="edit-modal-tabs">
                    <button
                        className={`tab-button ${activeTab === 'paraMim' ? 'active' : ''}`}
                        onClick={() => handleTabChange('paraMim')}
                    >
                        Para mim
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'queCriei' ? 'active' : ''}`}
                        onClick={() => handleTabChange('queCriei')}
                    >
                        Que criei
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'queEuSigo' ? 'active' : ''}`}
                        onClick={() => handleTabChange('queEuSigo')}
                    >
                        Que eu sigo
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'backlog' ? 'active' : ''}`}
                        onClick={() => handleTabChange('backlog')}
                    >
                        Backlog
                    </button>
                </div>
                <div className="tab-content">
                    {['paraMim', 'queCriei', 'queEuSigo'].includes(activeTab) && (
                        <div>
                            <div className="fixed-buttons">
                                <button
                                    className={`btn ${taskStatus === 'abertas' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleStatusChange('abertas')}
                                >
                                    Abertas
                                </button>
                                <button
                                    className={`btn ${taskStatus === 'fechadas' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleStatusChange('fechadas')}
                                >
                                    Entregues
                                </button>
                            </div>
                            <div className="task-list">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map(task => (
                                        <div key={task.id} className="task-item">
                                            <div className="task-column">
                                                <p>ID: {task.id}</p>
                                                <p>Cliente: {task.client ? task.client.nome_fantasia : 'Desconhecido'}</p>
                                                <Link href={`/clients/${task.client_id}`}>Ver Cliente</Link>
                                                <p>Tarefa: {task.tipo_tarefa ? task.tipo_tarefa.nome.split(' - ')[1] : 'Desconhecido'}</p>
                                                <p>Criador: {task.creator_name}</p>
                                            </div>
                                            <div className="task-column">
                                                <p>Data de Entrega: {formatDate(task.due_date)}</p>
                                                {task.status === 'trabalhando' && (
                                                    <p>Tempo decorrido: {formatElapsedTime(elapsedTime[task.id] || 0)}</p>
                                                )}
                                            </div>
                                            <div className="task-column">
                                                {task.status === 'fechadas' ? (
                                                    <button className="btn btn-secondary" onClick={() => handleReopenTask(task)}>Reabrir</button>
                                                ) : (
                                                    <button className="btn btn-primary" onClick={() => openModal(task)}>Ver Detalhes</button>
                                                )}
                                                {task.status === 'aberto' && (
                                                    <button className="btn btn-secondary" onClick={() => handleStartTask(task)}>Iniciar</button>
                                                )}
                                                {task.status === 'trabalhando' && (
                                                    <button className="btn btn-success" onClick={() => handleCompleteTask(task)}>Completar</button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No tasks found.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'backlog' && (
                        <div>
                            <label htmlFor="team-select">Selecione a equipe:</label>
                            <select id="team-select" value={selectedTeam} onChange={handleTeamChange}>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            <div className="task-list">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map(task => (
                                        <div key={task.id} className="task-item">
                                            <div className="task-column">
                                                <p>ID: {task.id}</p>
                                                <p>Cliente: {task.client ? task.client.nome_fantasia : 'Desconhecido'}</p>
                                                <Link href={`/clients/${task.client_id}`}>Ver Cliente</Link>
                                                <p>Tarefa: {task.tipo_tarefa ? task.tipo_tarefa.nome.split(' - ')[1] : 'Desconhecido'}</p>
                                                <p>Criador: {task.creator_name}</p>
                                            </div>
                                            <div className="task-column">
                                                <p>Data de Entrega: {formatDate(task.due_date)}</p>
                                            </div>
                                            <div className="task-column">
                                                <button className="btn btn-primary" onClick={() => openModal(task)}>Ver Detalhes</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No tasks found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {modalIsOpen && (
                    <TaskResponseModal
                        task={selectedTask}
                        closeModal={closeModal}
                        updateTaskStatus={handleStatusChange}
                        addComment={handleAddComment}
                        comments={taskComments}
                        user={user}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        followers={followers}
                        users={users}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Tarefas;
