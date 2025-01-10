import React, { useState, useRef } from 'react';
import '../../../css/components/modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons';

const TaskResponseModal = ({
    task,
    closeModal,
    updateTaskStatus,
    addComment,
    comments,
    newComment,
    setNewComment,
    user,
    attachments,
    setAttachments,
    users,
}) => {
    const [status, setStatus] = useState(task.status);
    const [activeTab, setActiveTab] = useState('comments');
    const [selectedFollower, setSelectedFollower] = useState('');
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    const fileInputRef = useRef(null);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        updateTaskStatus(newStatus);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleAddComment = () => {
        if (newComment.trim() === '') return;

        const commentData = {
            text: newComment,
            date: new Date().toISOString(),
            user: {
                name: user.name,
                id: user.id,
            },
        };

        addComment(commentData);
        setNewComment('');
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('task_id', task.id);

        try {
            const response = await fetch('/api/uploadAttachment', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setAttachments((prevAttachments) => [...prevAttachments, data]);
            } else {
                console.error('Erro ao anexar arquivo:', data);
            }
        } catch (error) {
            console.error('Erro ao anexar arquivo:', error);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveAttachment = async () => {
        try {
            for (const attachmentId of selectedAttachments) {
                const response = await fetch(`/api/attachments/${attachmentId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                });

                if (!response.ok) {
                    console.error('Erro ao remover anexo:', await response.json());
                }
            }

            setAttachments((prevAttachments) => prevAttachments.filter(attachment => !selectedAttachments.includes(attachment.id)));
            setSelectedAttachments([]);
        } catch (error) {
            console.error('Erro ao remover anexo:', error);
        }
    };

    const handleAddFollower = async () => {
        if (!selectedFollower) return;

        try {
            const response = await fetch(`/api/cronograma/${task.id}/add-follower`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ follower_id: selectedFollower }),
            });

            const data = await response.json();
            if (response.ok) {
                task.followers.push(data);
                setSelectedFollower('');
            } else {
                console.error('Erro ao adicionar seguidor:', data);
            }
        } catch (error) {
            console.error('Erro ao adicionar seguidor:', error);
        }
    };

    const handleRemoveFollower = async (followerId) => {
        try {
            const response = await fetch(`/api/cronograma/${task.id}/remove-follower`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ follower_id: followerId }),
            });

            const responseText = await response.text();
            console.log('Response text:', responseText); // Add logging

            const data = JSON.parse(responseText);
            if (response.ok) {
                task.followers = task.followers.filter(follower => follower.id !== followerId);
            } else {
                console.error('Erro ao remover seguidor:', data);
            }
        } catch (error) {
            console.error('Erro ao remover seguidor:', error);
        }
    };

    const handleAttachmentSelect = (attachmentId) => {
        setSelectedAttachments((prevSelected) =>
            prevSelected.includes(attachmentId)
                ? prevSelected.filter(id => id !== attachmentId)
                : [...prevSelected, attachmentId]
        );
    };

    const availableUsers = users ? users.filter(user => !task.followers.some(follower => follower.id === user.id)) : [];

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
                                    <span className="deadline">Data Limite: {new Date(task.date).toLocaleDateString()}</span> {/* Adicione esta linha */}
                                    <span>Status: {status}</span>
                                    <span>Projeto: {task.client ? task.client.nome_fantasia : 'Desconhecido'}</span>
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
                                Anexo ({attachments.length})
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
                                    <button onClick={handleAddComment}>
                                        <FontAwesomeIcon icon={faPaperPlane} />
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
                                            {comment.user && (
                                                <>
                                                    <small>{new Date(comment.date).toLocaleString()} - {comment.user.name}</small>
                                                    <p>{comment.text}</p>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'attachments' && (
                            <div className="attachments-section">
                                <div className="input-group">
                                    <button type="button" className="btn btn-secondary" onClick={handleFileClick}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <FontAwesomeIcon icon={faPaperclip} />
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={handleRemoveAttachment}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                                {attachments.length === 0 ? (
                                    <p>Não há anexos para esta tarefa.</p>
                                ) : (
                                    attachments.map((attachment, index) => (
                                        <div key={index} className="attachment">
                                            <input
                                                type="checkbox"
                                                checked={selectedAttachments.includes(attachment.id)}
                                                onChange={() => handleAttachmentSelect(attachment.id)}
                                            />
                                            <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                                                {attachment.name || attachment.file_name}
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'followers' && (
                            <div className="followers-section">
                                <div className="input-group">
                                    <select
                                        value={selectedFollower}
                                        onChange={(e) => setSelectedFollower(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Selecione um Usuário</option>
                                        {availableUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={handleAddFollower} className="btn btn-primary">
                                        Adicionar
                                    </button>
                                </div>
                                {task.followers && task.followers.length > 0 ? (
                                    task.followers.map((follower, index) => (
                                        <div key={index} className="follower">
                                            <p>{follower.name}</p>
                                            <button onClick={() => handleRemoveFollower(follower.id)} className="btn btn-danger">
                                                Remover
                                            </button>
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
