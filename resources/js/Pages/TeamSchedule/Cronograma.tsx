import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TaskModal from './TaskModal';
import TaskResponseModal from './TaskResponseModal';
import '../../../css/components/cronograma.css';

const Cronograma = ({ user, teamSchedules, sectors, users }) => {
    const [cronogramas, setCronogramas] = useState(teamSchedules || []);
    const [equipes, setEquipes] = useState(sectors || []);
    const [selectedEquipe, setSelectedEquipe] = useState(user?.sector?.name || '');
    const [indicatorPosition, setIndicatorPosition] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [reminderDate, setReminderDate] = useState('');
    const [priority, setPriority] = useState('normal'); // Definir prioridade padrão como 'normal'
    const [followerId, setFollowerId] = useState(null);
    const [taskType, setTaskType] = useState('sector');
    const [clientId, setClientId] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [sectorUsers, setSectorUsers] = useState([]);
    const [taskStatus, setTaskStatus] = useState('aberto');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const debounceTimeout = useRef(null);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    const fetchCronogramas = useCallback(async () => {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/tasks?equipe=${selectedEquipe}`);
                const data = await response.json();
                setCronogramas(data || []);
            } catch (error) {
                console.error('Erro ao buscar cronogramas:', error);
                setCronogramas([]);
            } finally {
                setLoading(false);
            }
        }, 1000);
    }, [selectedEquipe]);

    const fetchClients = useCallback(async () => {
        try {
            const response = await fetch('/api/clients');
            const data = await response.json();
            setClients(data || []);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    }, []);

    useEffect(() => {
        fetchCronogramas();
        fetchClients();
    }, [fetchCronogramas, fetchClients]);

    const fetchSectorUsers = useCallback((sectorId) => {
        const filteredUsers = users.filter(user => user.sector_id === parseInt(sectorId));
        setSectorUsers(filteredUsers);
    }, [users]);

    useEffect(() => {
        if (selectedSector) {
            fetchSectorUsers(selectedSector);
        }
    }, [selectedSector, fetchSectorUsers]);

    const handleTabChange = (equipe, index) => {
        setSelectedEquipe(equipe);
        setIndicatorPosition(index * 132);
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setTaskTitle(task ? task.title : '');
        setTaskDescription(task ? task.description : '');
        setReminderDate(task ? task.date.split('T')[0] : ''); // Ensure date is in YYYY-MM-DD format
        setPriority(task ? task.priority : 'normal');
        setSelectedSector(task ? task.sector_id.toString() : '');
        setTaskStatus(task ? task.status : 'aberto');
        setModalIsOpen(true);
    };

    const openResponseModal = (task) => {
        setSelectedTask(task);
        setComments(task.comments || []);
        setResponseModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setResponseModalIsOpen(false);
        setSelectedTask(null);
        setReminderDate('');
        setPriority('normal');
        setFollowerId(null);
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatus('aberto');
        setNewComment('');
    };

    const saveTaskDetails = async () => {
        let sectorId = selectedSector;
        if (taskType === 'sector' && !selectedSector) {
            const sectorResponse = await fetch(`/api/sectors?name=${user.sector}`);
            const sectorData = await sectorResponse.json();
            if (sectorData.error) {
                alert('Erro ao buscar setor: ' + sectorData.error);
                return;
            }
            sectorId = sectorData.id.toString();
        }

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            date: reminderDate || new Date().toISOString().slice(0, 10),
            sector_id: parseInt(sectorId),
            user_id: taskType === 'individual' ? followerId : null,
            client_id: clientId,
            priority: priority,
            status: 'aberto',
        };

        try {
            const response = await fetch('/api/teamSchedule/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(newTask),
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Erro ao analisar JSON: ' + responseText);
            }

            setCronogramas((prevCronogramas) => [...prevCronogramas, data]);
        } catch (error) {
            alert('Erro ao salvar a tarefa: ' + error.message);
        }

        closeModal();
    };

    const updateTaskDetails = async () => {
        let sectorId = selectedSector;
        if (taskType === 'sector' && !selectedSector) {
            const sectorResponse = await fetch(`/api/sectors?name=${user.sector}`);
            const sectorData = await sectorResponse.json();
            if (sectorData.error) {
                alert('Erro ao buscar setor: ' + sectorData.error);
                return;
            }
            sectorId = sectorData.id.toString();
        }

        const updatedTask = {
            title: taskTitle,
            description: taskDescription,
            date: reminderDate,
            sector_id: parseInt(sectorId),
            user_id: taskType === 'individual' ? followerId : null,
            client_id: clientId,
            priority: priority,
            status: taskStatus,
        };

        try {
            const response = await fetch(`/cronograma/${selectedTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(updatedTask),
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Erro ao analisar JSON: ' + responseText);
            }

            setCronogramas((prevCronogramas) =>
                prevCronogramas.map((task) => (task.id === selectedTask.id ? data : task))
            );
        } catch (error) {
            alert('Erro ao atualizar a tarefa: ' + error.message);
        }

        closeModal();
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/cronograma/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });
            await response.json();
            setCronogramas((prevCronogramas) => prevCronogramas.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Erro ao deletar a tarefa:', error);
        }
    };

    const updateTaskStatus = async (status) => {
        try {
            const response = await fetch(`/cronograma/${selectedTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ status }),
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Erro ao analisar JSON: ' + responseText);
            }

            setCronogramas((prevCronogramas) =>
                prevCronogramas.map((task) => (task.id === selectedTask.id ? data : task))
            );
        } catch (error) {
            alert('Erro ao atualizar o status da tarefa: ' + error.message);
        }

        closeModal();
    };

    const addComment = async () => {
        const newCommentData = {
            text: newComment,
            date: new Date().toISOString(),
        };

        try {
            const response = await fetch(`/cronograma/${selectedTask.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(newCommentData),
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Erro ao analisar JSON: ' + responseText);
            }

            setComments((prevComments) => [...prevComments, data]);
            setNewComment('');
        } catch (error) {
            alert('Erro ao adicionar comentário: ' + error.message);
        }
    };

    const renderCalendar = useCallback(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        let weeks = [];
        let days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const tasksForDay = cronogramas.filter((task) => {
                const taskDate = new Date(task.date);
                const isTaskForDay = taskDate.getUTCDate() === day && taskDate.getUTCMonth() === currentMonth && taskDate.getUTCFullYear() === currentYear;
                const isTaskForUser = task.sector_id === user.sector_id || task.user_id === user.id;
                return isTaskForDay && isTaskForUser;
            });
            days.push(
                <div key={day} className="calendar-day">
                    <div className="day-number">{day}</div>
                    {tasksForDay.map((task, index) => (
                        <div key={index} className={`task ${task.priority}`} onClick={() => openModal(task)}>
                            {task.title}
                        </div>
                    ))}
                </div>
            );

            if (days.length === 7 || day === daysInMonth) {
                weeks.push(
                    <div key={weeks.length} className="calendar-week">
                        {days}
                    </div>
                );
                days = [];
            }
        }

        return weeks;
    }, [cronogramas, user.sector_id, user.id, openModal]);

    const memoizedCalendar = useMemo(() => renderCalendar(), [renderCalendar]);

    return (
        <AuthenticatedLayout user={user}>
            <div className="calendar-container">
                <h1>Calendário de Tarefas</h1>
                <div className="tab-container">
                    {equipes.map((equipe, index) => (
                        <div key={index} className="tab">
                            <input
                                type="radio"
                                name="tab"
                                id={`tab${index}`}
                                className="tab_input"
                                checked={selectedEquipe === equipe.name}
                                onChange={() => handleTabChange(equipe.name, index)}
                            />
                            <label className="tab_label" htmlFor={`tab${index}`}>
                                {equipe.name}
                            </label>
                        </div>
                    ))}
                    <div className="indicator" style={{ left: `${indicatorPosition}px` }} />
                </div>

                <div className="header-container">
                    <button className="add-task-button" onClick={() => openModal(null)}>Adicionar Tarefa</button>
                    <div className="legenda-container">
                        <div className="legenda-item">
                            <span className="legenda-task normal" /> Normal
                        </div>
                        <div className="legenda-item">
                            <span className="legenda-task atencao" /> Atenção
                        </div>
                        <div className="legenda-item">
                            <span className="legenda-task urgente" /> Urgente
                        </div>
                    </div>
                </div>

                <div>{memoizedCalendar}</div>

                {modalIsOpen && (
                    <TaskModal
                        taskType={taskType}
                        setTaskType={setTaskType}
                        taskTitle={taskTitle}
                        setTaskTitle={setTaskTitle}
                        taskDescription={taskDescription}
                        setTaskDescription={setTaskDescription}
                        reminderDate={reminderDate}
                        setReminderDate={setReminderDate}
                        clientId={clientId}
                        setClientId={setClientId}
                        clients={clients}
                        selectedSector={selectedSector}
                        setSelectedSector={setSelectedSector}
                        followerId={followerId}
                        setFollowerId={setFollowerId}
                        sectorUsers={sectorUsers}
                        saveTaskDetails={saveTaskDetails}
                        updateTaskDetails={updateTaskDetails}
                        deleteTask={deleteTask}
                        selectedTask={selectedTask}
                        closeModal={closeModal}
                        equipes={equipes}
                        priority={priority}
                        setPriority={setPriority}
                        taskStatus={taskStatus}
                        setTaskStatus={setTaskStatus}
                        fetchSectorUsers={fetchSectorUsers}
                        users={users} // Pass the list of active users to TaskModal
                    />
                )}

                {responseModalIsOpen && (
                    <TaskResponseModal
                        selectedTask={selectedTask}
                        comments={comments}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        addComment={addComment}
                        closeModal={closeModal}
                        updateTaskStatus={updateTaskStatus}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Cronograma;
