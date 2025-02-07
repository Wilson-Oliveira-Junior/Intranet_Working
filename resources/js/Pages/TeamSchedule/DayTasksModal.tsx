import React from 'react';
import '../../../css/components/modal.css';

const DayTasksModal = ({ tasks, openResponseModal, closeModal }) => {
    const handleTaskClick = (task) => {
        closeModal();
        openResponseModal(task);
    };

    const isDarkMode = document.body.classList.contains('dark-mode');

    return (
        <div className="modal-container">
            <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className={`modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
                    <div className="header">
                        <h2>Tarefas do Dia</h2>
                        <span className="close" onClick={closeModal}>&times;</span>
                    </div>
                    <div className="content">
                        {tasks.length === 0 ? (
                            <p>Não há tarefas para este dia.</p>
                        ) : (
                            <ul>
                                {tasks.map((task) => (
                                    <li key={task.id} onClick={() => handleTaskClick(task)}>
                                        {task.title} - {task.priority}
                                    </li>
                                ))}
                            </ul>
                        )}
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
