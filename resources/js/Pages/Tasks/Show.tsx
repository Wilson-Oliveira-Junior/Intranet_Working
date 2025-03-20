import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/pages/TaskShow.css";

const TaskShow = () => {
    const { task } = usePage().props;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Data Inválida' : date.toLocaleDateString();
    };

    return (
        <AuthenticatedLayout>
            <div className="task-show-container">
                <h1 className="task-show-title">{task.title}</h1>
                <div className="task-details">
                    <p><strong>Descrição:</strong> {task.description}</p>
                    <p><strong>Data Limite:</strong> {formatDate(task.date)}</p>
                    <p><strong>Prioridade:</strong> {task.priority}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                </div>
                <div className="task-section">
                    <h2>Comentários</h2>
                    {task.comments.length > 0 ? (
                        <ul className="task-comments-list">
                            {task.comments.map((comment) => (
                                <li key={comment.id} className="task-comment-item">
                                    <p><strong>{comment.user.name}:</strong> {comment.text}</p>
                                    <p className="comment-date">{formatDate(comment.created_at)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-comments">Sem comentários.</p>
                    )}
                </div>
                <div className="task-section">
                    <h2>Anexos</h2>
                    {task.attachments.length > 0 ? (
                        <ul className="task-attachments-list">
                            {task.attachments.map((attachment) => (
                                <li key={attachment.id} className="task-attachment-item">
                                    <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                                        {attachment.file_name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-attachments">Sem anexos.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TaskShow;
