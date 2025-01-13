import React, { useState, useRef, useEffect } from 'react';
import '../../../css/components/modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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
    const [followers, setFollowers] = useState(task.followers);
    const [taskComments, setTaskComments] = useState(comments);
    const [editingComment, setEditingComment] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');
    const fileInputRef = useRef(null);
    const [workingUser, setWorkingUser] = useState(null);
    const [startTime, setStartTime] = useState(null);

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        updateTaskStatus(newStatus);

        if (newStatus === 'em andamento') {
            setWorkingUser(user);
            setStartTime(new Date());

            // Inform the task creator
            try {
                await fetch(`/tasks/${task.id}/notify-creator`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ message: `A tarefa está sendo trabalhada por ${user.name}` }),
                });
            } catch (error) {
                console.error('Erro ao notificar o criador da tarefa:', error);
            }

            // Notify followers
            try {
                await fetch(`/tasks/${task.id}/notify-followers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ message: `A tarefa começou a ser trabalhada por ${user.name}` }),
                });
            } catch (error) {
                console.error('Erro ao notificar os seguidores da tarefa:', error);
            }
        } else if (newStatus === 'concluído' || newStatus === 'finalizado') {
            const endTime = new Date();
            const hoursWorked = (endTime - startTime) / 1000 / 60 / 60;

            // Log hours worked
            try {
                await fetch(`/tasks/${task.id}/log-hours`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ hours: hoursWorked, user_id: user.id }),
                });
            } catch (error) {
                console.error('Erro ao registrar horas trabalhadas:', error);
            }

            // Inform the task creator
            try {
                await fetch(`/tasks/${task.id}/notify-creator`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ message: `A tarefa foi entregue por ${user.name}` }),
                });
            } catch (error) {
                console.error('Erro ao notificar o criador da tarefa:', error);
            }

            // Notify followers
            try {
                await fetch(`/tasks/${task.id}/notify-followers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ message: `A tarefa foi entregue por ${user.name}` }),
                });
            } catch (error) {
                console.error('Erro ao notificar os seguidores da tarefa:', error);
            }
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        const commentData = {
            text: newComment,
            date: new Date().toISOString(),
            user: {
                name: user.name,
                id: user.id,
            },
        };

        try {
            const response = await fetch(`/tasks/${task.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(commentData),
            });

            const data = await response.json();
            if (response.ok) {
                setTaskComments((prevComments) => [...prevComments, data]);
                setNewComment('');
            } else {
                console.error('Erro ao adicionar comentário:', data);
            }
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setEditedCommentText(comment.text);
    };

    const handleUpdateComment = async () => {
        if (editedCommentText.trim() === '') return;

        try {
            const response = await fetch(`/tasks/${task.id}/comments/${editingComment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ text: editedCommentText }),
            });

            const data = await response.json();
            if (response.ok) {
                setTaskComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === editingComment.id ? { ...comment, text: editedCommentText } : comment
                    )
                );
                setEditingComment(null);
                setEditedCommentText('');
            } else {
                console.error('Erro ao atualizar comentário:', data);
            }
        } catch (error) {
            console.error('Erro ao atualizar comentário:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`/tasks/${task.id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            if (response.ok) {
                setTaskComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
            } else {
                console.error('Erro ao deletar comentário:', await response.json());
            }
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
        }
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
                const newFollower = users.find(user => user.id === data.id);
                if (newFollower && !followers.some(follower => follower.id === newFollower.id)) {
                    setFollowers((prevFollowers) => [...prevFollowers, newFollower]);
                }
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

            const data = await response.json();
            if (response.ok) {
                setFollowers((prevFollowers) => prevFollowers.filter(follower => follower.id !== followerId));
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

    const availableUsers = users ? users.filter(user => followers && followers.every(follower => follower && follower.id !== user.id)) : [];

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
                                    {workingUser && <span>Trabalhando por: {workingUser.name}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="description">
                            <p>{task.description}</p>
                        </div>
                        <div className="tabs">
                            <button className={activeTab === 'comments' ? 'active' : ''} onClick={() => handleTabChange('comments')}>
                                Comentário ({taskComments.length})
                            </button>
                            <button className={activeTab === 'attachments' ? 'active' : ''} onClick={() => handleTabChange('attachments')}>
                                Anexo ({attachments.length})
                            </button>
                            <button className={activeTab === 'followers' ? 'active' : ''} onClick={() => handleTabChange('followers')}>
                                Seguidores ({followers.length})
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'comments' && (
                                <>
                                    <div className="input-group fixed-input">
                                        <textarea
                                            placeholder="Escreva o comentário da tarefa..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <button onClick={handleAddComment}>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                    <div className="comment-section" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        {taskComments.length === 0 ? (
                                            <div className="no-comments">
                                                <p>
                                                    Essa tarefa ainda não possui comentários.
                                                    <br />
                                                    Comentário de sistema não será postado.
                                                </p>
                                            </div>
                                        ) : (
                                            taskComments.map((comment, index) => (
                                                <div key={index} className="comment">
                                                    {comment.user && (
                                                        <>
                                                            <small>{new Date(comment.date).toLocaleString()} - {comment.user.name}</small>
                                                            {editingComment && editingComment.id === comment.id ? (
                                                                <div className="edit-comment">
                                                                    <textarea
                                                                        value={editedCommentText}
                                                                        onChange={(e) => setEditedCommentText(e.target.value)}
                                                                    />
                                                                    <button onClick={handleUpdateComment}>
                                                                        <FontAwesomeIcon icon={faPaperPlane} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <p>{comment.text}</p>
                                                            )}
                                                            <div className="comment-actions">
                                                                <button onClick={() => handleEditComment(comment)}>
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </button>
                                                                <button onClick={() => handleDeleteComment(comment.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                            {activeTab === 'attachments' && (
                                <div className="attachments-section" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                                <div className="followers-section" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                                    {followers.length > 0 ? (
                                        followers.map((follower, index) => (
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
