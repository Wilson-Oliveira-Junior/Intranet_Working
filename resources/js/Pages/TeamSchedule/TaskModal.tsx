import React, { useState } from 'react';

const TaskModal = ({
    taskType,
    setTaskType,
    taskTitle,
    setTaskTitle,
    taskDescription,
    setTaskDescription,
    reminderDate,
    setReminderDate,
    clientId,
    setClientId,
    clients,
    selectedSector,
    setSelectedSector,
    followerId,
    setFollowerId,
    sectorUsers,
    saveTaskDetails,
    updateTaskDetails,
    deleteTask,
    selectedTask,
    closeModal,
    priority,
    setPriority,
    taskStatus,
    setTaskStatus,
    equipes,
    fetchSectorUsers,
    users,
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFollower, setSelectedFollower] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFollowerChange = (e) => {
        setSelectedFollower(e.target.value);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{selectedTask ? 'Editar Tarefa' : 'Criar nova Tarefa'}</h2>
                    <span className="close" onClick={closeModal}>&times;</span>
                </div>
                <div className="form-group">
                    <label htmlFor="titulo">Título da tarefa</label>
                    <input
                        type="text"
                        id="titulo"
                        placeholder="Título da tarefa"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="alocados">Alocados</label>
                    <div className="input-group">
                        <button
                            className={taskType === 'individual' ? 'active' : ''}
                            onClick={() => setTaskType('individual')}
                        >
                            <i className="fas fa-user"></i>
                        </button>
                        <button
                            className={taskType === 'sector' ? 'active' : ''}
                            onClick={() => setTaskType('sector')}
                        >
                            <i className="fas fa-users"></i>
                        </button>
                        {taskType === 'individual' ? (
                            <select
                                id="alocados"
                                value={followerId}
                                onChange={(e) => setFollowerId(e.target.value)}
                            >
                                <option value="">Selecione um Usuário</option>
                                {users.filter(user => user.status === 'active').map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <select
                                id="alocados"
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                            >
                                <option value="">Selecione um Setor</option>
                                {equipes.map((equipe) => (
                                    <option key={equipe.id} value={equipe.id}>
                                        {equipe.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="tipo">Tipo</label>
                    <select
                        id="tipo"
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                    >
                        <option value="sector">Setor</option>
                        <option value="individual">Individual</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="projeto">Projeto</label>
                    <select
                        id="projeto"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                    >
                        <option value="">Selecione um Cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <div className="editor-toolbar">
                        <select>
                            <option>Normal</option>
                        </select>
                        <div>
                            <button><i className="fas fa-bold"></i></button>
                            <button><i className="fas fa-italic"></i></button>
                            <button><i className="fas fa-underline"></i></button>
                            <button><i className="fas fa-link"></i></button>
                            <button><i className="fas fa-image"></i></button>
                            <button><i className="fas fa-list-ul"></i></button>
                            <button><i className="fas fa-list-ol"></i></button>
                            <button><i className="fas fa-align-left"></i></button>
                            <button><i className="fas fa-align-center"></i></button>
                            <button><i className="fas fa-align-right"></i></button>
                            <button><i className="fas fa-align-justify"></i></button>
                        </div>
                    </div>
                    <textarea
                        id="descricao"
                        placeholder="Escreva a descrição da tarefa..."
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                </div>
                <div className="form-footer">
                    <div className="icons">
                        <button>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <i className="fas fa-paperclip"></i>
                        </button>
                        <button>
                            <input
                                type="date"
                                style={{ display: 'none' }}
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                            />
                            <i className="fas fa-calendar-alt"></i>
                        </button>
                        <button>
                            <select
                                value={selectedFollower}
                                onChange={handleFollowerChange}
                            >
                                <option value="">Adicionar Seguidor</option>
                                {users.filter(user => user.status === 'active').map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            <i className="fas fa-users"></i>
                        </button>
                    </div>
                    <button
                        className="submit-btn"
                        onClick={selectedTask ? updateTaskDetails : saveTaskDetails}
                    >
                        {selectedTask ? 'Atualizar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
