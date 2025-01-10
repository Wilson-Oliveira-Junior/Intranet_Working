import React from 'react';
import '../../../css/components/modal.css';

const DayTasksModal = ({ tasks, openResponseModal, closeModal }) => {
    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-content">
                    <div className="header">
                        <h1>Tarefas do Dia</h1>
                    </div>
                    <div className="content">
                        {tasks.map((task, index) => (
                            <div key={index} className="task-item" onClick={() => openResponseModal(task)}>
                                <div className={`task ${task.priority}`}>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button onClick={closeModal} className="modal-button">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayTasksModal;
