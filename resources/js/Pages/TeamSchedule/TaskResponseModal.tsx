import React, { useState } from 'react';
import '../../../css/components/modal.css';

const TaskResponseModal = ({
    task,
    closeModal,
    updateTaskStatus,
    addComment,
    comments,
    newComment,
    setNewComment,
}) => {
    const [status, setStatus] = useState(task.status);
    const [activeTab, setActiveTab] = useState('comments');

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        updateTaskStatus(newStatus);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-content">
                    <div className="header">
                        <h1>{task.title}</h1>
                        <div className="buttons">
                            <button onClick={() => handleStatusChange('concluído')}>Entregar</button>
                            <button onClick={() => handleStatusChange('em andamento')}>Começar</button>
                        </div>
                    </div>
                    <div className="content">
                        <div className="info">
                            <div className="left">
                                <img src="https://placehold.co/50x50" alt="User profile picture" />
                                <div className="details">
                                    <span>ID: {task.id} - Criado por: {task.creator ? task.creator.name : 'Desconhecido'} em {new Date(task.created_at).toLocaleDateString()}</span>
                                    <span>Status: {status}</span>
                                    <span>Projeto: {task.client ? task.client.name : 'Desconhecido'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="description">
                            <p>{task.description}</p>
                        </div>
                        <div className="tabs">
                            <button className={activeTab === 'comments' ? 'active' : ''} onClick={() => handleTabChange('comments')}>
                                Comentário ({comments.length})
                            </button>
                            <button className={activeTab === 'attachments' ? 'active' : ''} onClick={() => handleTabChange('attachments')}>
                                Anexo ({task.attachments ? task.attachments.length : 0})
                            </button>
                            <button className={activeTab === 'followers' ? 'active' : ''} onClick={() => handleTabChange('followers')}>
                                Seguidores ({task.followers ? task.followers.length : 0})
                            </button>
                        </div>
                        {activeTab === 'comments' && (
                            <div className="comment-section">
                                <div className="input-group">
                                    <textarea
                                        placeholder="Escreva o comentário da tarefa..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button onClick={addComment}>
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                                {comments.length === 0 ? (
                                    <div className="no-comments">
                                        <p>
                                            Essa tarefa ainda não possui comentários.
                                            <br />
                                            Comentário de sistema não será postado.
                                        </p>
                                    </div>
                                ) : (
                                    comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <p>{comment.text}</p>
                                            <small>{comment.date}</small>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'attachments' && (
                            <div className="attachments-section">
                                {task.attachments && task.attachments.length > 0 ? (
                                    task.attachments.map((attachment, index) => (
                                        <div key={index} className="attachment">
                                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                {attachment.name}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p>Não há anexos para esta tarefa.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'followers' && (
                            <div className="followers-section">
                                {task.followers && task.followers.length > 0 ? (
                                    task.followers.map((follower, index) => (
                                        <div key={index} className="follower">
                                            <p>{follower.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Não há seguidores para esta tarefa.</p>
                                )}
                            </div>
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

export default TaskResponseModal;
