import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/taskdetails.css';

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    status: string;
    comments: Comment[];
    attachments: Attachment[];
}

interface Comment {
    id: number;
    text: string;
    user: {
        name: string;
    };
    created_at: string;
}

interface Attachment {
    id: number;
    file_path: string;
    file_name: string;
}

interface TaskDetailsProps {
    task: Task;
    auth: {
        user: {
            name: string;
        };
    };
}

const TaskDetails: React.FC = () => {
    const { task: initialTask, auth } = usePage<TaskDetailsProps>().props;
    const [task, setTask] = useState<Task>({
        ...initialTask,
        comments: initialTask.comments || [],
        attachments: initialTask.attachments || [],
    });

    useEffect(() => {
        setTask({
            ...initialTask,
            comments: initialTask.comments || [],
            attachments: initialTask.attachments || [],
        });
    }, [initialTask]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Data Inválida' : date.toLocaleDateString();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="task-details-container">
                <h1 className="task-title">{task.title}</h1>
                <p className="task-description">{task.description}</p>
                <p className="task-date"><strong>Data Limite:</strong> {formatDate(task.date)}</p>
                <p className="task-status"><strong>Status:</strong> {task.status}</p>
                <div className="task-comments">
                    <h2>Comentários</h2>
                    <ul>
                        {task.comments.map(comment => (
                            <li key={comment.id} className="comment-item">
                                <p>{comment.text}</p>
                                <p><strong>{comment.user.name}</strong> em {formatDate(comment.created_at)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="task-attachments">
                    <h2>Anexos</h2>
                    <ul>
                        {task.attachments.map(attachment => (
                            <li key={attachment.id} className="attachment-item">
                                <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">{attachment.file_name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TaskDetails;
