import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import '../../../css/components/tarefas.css';
import TaskResponseModal from '../TeamSchedule/TaskResponseModal';

const Tarefas = ({ user, teams, tasks, clients, tiposTarefa, users }) => { // Ensure users is passed as a prop
    const [activeTab, setActiveTab] = useState('paraMim');
    const [selectedTeam, setSelectedTeam] = useState(user?.sector_id || '');
    const [taskStatus, setTaskStatus] = useState('abertas');
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [taskComments, setTaskComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        if (!user || !teams) {
            console.error('User or teams data is missing');
        }
        console.log('Tasks:', tasks);
    }, [user, teams, tasks]);

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

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'paraMim') {
            return task.user_id === user.id && task.status === (taskStatus === 'abertas' ? 'open' : 'closed');
        }
        return false;
    });

    useEffect(() => {
        console.log('Filtered Tasks:', filteredTasks);
    }, [filteredTasks]);

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
                    {activeTab === 'paraMim' && (
                        <div>
                            <div className="fixed-buttons">
                                <button
                                    className={`btn ${taskStatus === 'abertas' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleStatusChange('abertas')}
                                >
                                    Abertas
                                </button>
                                <button
                                    className={`btn ${taskStatus === 'entregues' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleStatusChange('entregues')}
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
                                                <p>Cliente: {task.client_name}</p>
                                                <Link href={`/clients/${task.client_id}`}>Ver Cliente</Link>
                                                <p>Tipo: {task.type}</p>
                                            </div>
                                            <div className="task-column">
                                                <p>Data de Entrega: {task.due_date}</p>
                                            </div>
                                            <div className="task-column">
                                                {taskStatus === 'abertas' ? (
                                                    <button className="btn btn-primary" onClick={() => openModal(task)}>Ver Detalhes</button>
                                                ) : (
                                                    <button className="btn btn-secondary">Reabrir</button>
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
                    {activeTab === 'queCriei' && (
                        <div>
                            <button className="btn btn-primary">Abertas</button>
                            <button className="btn btn-secondary">Entregues</button>
                            <div>Conteúdo da aba Que criei</div>
                        </div>
                    )}
                    {activeTab === 'queEuSigo' && (
                        <div>
                            <button className="btn btn-primary">Abertas</button>
                            <button className="btn btn-secondary">Entregues</button>
                            <div>Conteúdo da aba Que eu sigo</div>
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
                            <div>Conteúdo da aba Backlog para a equipe {selectedTeam}</div>
                        </div>
                    )}
                </div>
                {modalIsOpen && (
                    <TaskResponseModal
                        task={selectedTask}
                        closeModal={closeModal}
                        equipes={teams} // Ensure equipes prop is passed
                        clients={clients} // Ensure clients prop is passed
                        tiposTarefa={tiposTarefa} // Ensure tiposTarefa prop is passed
                        comments={taskComments} // Ensure comments prop is passed
                        attachments={attachments} // Ensure attachments prop is passed
                        setAttachments={setAttachments} // Ensure setAttachments is passed
                        followers={followers || []} // Ensure followers is initialized correctly
                        users={users} // Ensure users prop is passed
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Tarefas;
