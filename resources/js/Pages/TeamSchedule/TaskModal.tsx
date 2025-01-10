import React, { useState, useEffect, useRef } from 'react';
import '../../../css/components/modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faCalendarAlt, faPaperclip } from '@fortawesome/free-solid-svg-icons';

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
    users,
    tiposTarefa,
    tipoTarefaId,
    setTipoTarefaId,
    fetchSectorUsers,
    attachments,
    setAttachments,
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFollower, setSelectedFollower] = useState(null);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const fileInputRef = useRef(null);
    const dateInputRef = useRef(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFollowerChange = (e) => {
        setSelectedFollower(e.target.value);
    };

    const handleAddFollower = async () => {
        if (!selectedFollower) return;

        try {
            const response = await fetch(`/cronograma/${selectedTask.id}/add-follower`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ follower_id: selectedFollower }),
            });

            const responseText = await response.text();
            console.log('Response text:', responseText); // Add logging

            const data = JSON.parse(responseText);
            if (response.ok) {
                selectedTask.followers.push(data);
                setSelectedFollower('');
            } else {
                console.error('Erro ao adicionar seguidor:', data);
            }
        } catch (error) {
            console.error('Erro ao adicionar seguidor:', error);
        }
    };

    const handleDateChange = (e) => {
        setReminderDate(e.target.value);
    };

    const handleDateClick = () => {
        setShowDateModal(true);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', taskTitle);
        formData.append('description', taskDescription);
        formData.append('date', reminderDate);
        formData.append('sector_id', selectedSector);
        formData.append('user_id', taskType === 'individual' ? followerId : '');
        formData.append('client_id', clientId);
        formData.append('tipo_tarefa_id', tipoTarefaId);
        formData.append('priority', priority);
        formData.append('status', taskStatus);

        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        if (selectedTask) {
            await updateTaskDetails(formData);
        } else {
            await saveTaskDetails(formData);
        }

        closeModal();
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{selectedTask ? 'Editar Tarefa' : 'Criar nova Tarefa'}</h2>
                        <span className="close" onClick={closeModal}>&times;</span>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                    type="button"
                                    className={`btn ${taskType === 'individual' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setTaskType('individual')}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${taskType === 'sector' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setTaskType('sector')}
                                >
                                    <FontAwesomeIcon icon={faUsers} />
                                </button>
                                {taskType === 'individual' ? (
                                    <select
                                        id="alocados"
                                        value={followerId}
                                        onChange={(e) => setFollowerId(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Selecione um Usuário</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.sector})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select
                                        id="alocados"
                                        value={selectedSector}
                                        onChange={(e) => setSelectedSector(e.target.value)}
                                        className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                            <label htmlFor="tipoTarefa">Tipo de Tarefa</label> {/* Adicione esta linha */}
                            <select
                                id="tipoTarefa"
                                value={tipoTarefaId}
                                onChange={(e) => setTipoTarefaId(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Selecione um Tipo de Tarefa</option>
                                {tiposTarefa.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                placeholder="Escreva a descrição da tarefa..."
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="form-footer">
                            <div className="icons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowFollowerModal(true)}>
                                    <FontAwesomeIcon icon={faUsers} />
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleDateClick}>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleFileClick}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <FontAwesomeIcon icon={faPaperclip} />
                                </button>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {selectedTask ? 'Atualizar' : 'Adicionar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showFollowerModal && (
                <div className="mini-modal">
                    <div className="mini-modal-content">
                        <h3>Adicionar Seguidor</h3>
                        <select
                            value={selectedFollower}
                            onChange={handleFollowerChange}
                            className="form-control"
                        >
                            <option value="">Selecione um Usuário</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.sector})
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-primary" onClick={handleAddFollower}>
                            Adicionar
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowFollowerModal(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {showDateModal && (
                <div className="mini-modal">
                    <div className="mini-modal-content">
                        <h3>Selecionar Data e Urgência</h3>
                        <input
                            type="date"
                            ref={dateInputRef}
                            value={reminderDate}
                            onChange={handleDateChange}
                            className="form-control"
                        />
                        <select
                            value={priority}
                            onChange={handlePriorityChange}
                            className="form-control"
                        >
                            <option value="normal">Normal</option>
                            <option value="atencao">Atenção</option>
                            <option value="urgente">Urgente</option>
                        </select>
                        <button className="btn btn-secondary" onClick={() => setShowDateModal(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskModal;
