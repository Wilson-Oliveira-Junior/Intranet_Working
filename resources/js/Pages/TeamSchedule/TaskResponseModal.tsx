import React from 'react';

const TaskResponseModal = ({
    task,
    closeModal,
    updateTaskStatus,
    addComment,
    comments,
    newComment,
    setNewComment,
}) => (
    <div className="modal">
        <div className="modal-content">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Data de Lembrete: {task.date}</p>
            <p>Prioridade: {task.priority}</p>
            <p>Status: {task.status}</p>
            <div className="comments-section">
                <h3>Comentários</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p>{comment.text}</p>
                        <small>{comment.date}</small>
                    </div>
                ))}
                <textarea
                    placeholder="Adicionar comentário"
                    className="modal-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={addComment} className="modal-button">
                    Adicionar Comentário
                </button>
            </div>
            <button onClick={() => updateTaskStatus('concluído')} className="modal-button">
                Marcar como Concluído
            </button>
            <button onClick={closeModal} className="modal-button">
                Fechar
            </button>
        </div>
    </div>
);

export default TaskResponseModal;
