import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TaskModal from './TaskModal';
import TaskResponseModal from './TaskResponseModal';
import DayTasksModal from './DayTasksModal'; // Import the new modal
import '../../../css/components/cronograma.css'; // Import CSS do cronograma
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faUsers, faCalendarAlt, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faUsers, faCalendarAlt, faPaperclip, faPaperPlane);

const Cronograma = ({ user, teamSchedules, sectors, users, tiposTarefa }) => {
    const [cronogramas, setCronogramas] = useState(teamSchedules || []);
    const [equipes, setEquipes] = useState(sectors || []);
    const [selectedEquipe, setSelectedEquipe] = useState(user?.sector?.name || '');
    const [indicatorPosition, setIndicatorPosition] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
    const [dayTasksModalIsOpen, setDayTasksModalIsOpen] = useState(false); // Add state for day tasks modal
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDayTasks, setSelectedDayTasks] = useState([]); // Add state for tasks of the selected day
    const [reminderDate, setReminderDate] = useState('');
    const [priority, setPriority] = useState('normal');
    const [followerId, setFollowerId] = useState(null);
    const [taskType, setTaskType] = useState('sector');
    const [clientId, setClientId] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [sectorUsers, setSectorUsers] = useState([]);
    const [taskStatus, setTaskStatus] = useState('aberto');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [attachments, setAttachments] = useState([]); // Add state for attachments
    const [tipoTarefaId, setTipoTarefaId] = useState(''); // Add state for tipoTarefaId


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
        const filteredUsers = users.filter(user => user.sector_id === parseInt(sectorId) && user.status === 'active');
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
        setAttachments(task ? task.attachments || [] : []); // Ensure setAttachments is defined
        setTipoTarefaId(task ? task.tipo_tarefa_id : ''); // Ensure setTipoTarefaId is defined
        setModalIsOpen(true);
    };

    const openResponseModal = (task) => {
        setSelectedTask(task);
        setComments(task.comments || []);
        setAttachments(task ? task.attachments || [] : []); // Ensure setAttachments is defined
        setResponseModalIsOpen(true);
    };

    const openDayTasksModal = (tasks) => {
        setSelectedDayTasks(tasks);
        setDayTasksModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setResponseModalIsOpen(false);
        setDayTasksModalIsOpen(false); // Close day tasks modal
        setSelectedTask(null);
        setReminderDate('');
        setPriority('normal');
        setFollowerId(null);
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatus('aberto');
        setNewComment('');
        setAttachments([]); // Reset attachments
        setTipoTarefaId(''); // Reset tipoTarefaId
    };

    const saveTaskDetails = async (formData) => {
        try {
            const response = await fetch('/api/teamSchedule/store', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: formData,
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

    const updateTaskDetails = async (formData) => {
        try {
            const response = await fetch(`/cronograma/${selectedTask.id}`, {
                method: 'PUT',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: formData,
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

    const addComment = async (commentData) => {
        try {
            const response = await fetch(`/tasks/${selectedTask.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(commentData),
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
        } catch (error) {
            alert('Erro ao adicionar comentário: ' + error.message);
        }
    };

    const renderCalendar = useCallback(() => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        let weeks = [];
        let days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="cronograma-calendar-day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const tasksForDay = cronogramas.filter((task) => {
                const taskDate = new Date(task.date);
                const isTaskForDay = taskDate.getUTCDate() === day && taskDate.getUTCMonth() === currentMonth && taskDate.getUTCFullYear() === currentYear;
                const isTaskForUser = task.sector_id === user.sector_id || task.user_id === user.id;
                const isTaskOpenOrWorking = task.status === 'aberto' || task.status === 'trabalhando';
                return isTaskForDay && isTaskForUser && isTaskOpenOrWorking;
            });

            days.push(
                <div key={day} className="cronograma-calendar-day" onClick={() => tasksForDay.length > 1 ? openDayTasksModal(tasksForDay) : openResponseModal(tasksForDay[0])}>
                    <div className="cronograma-day-number">{day}</div>
                    {tasksForDay.length > 1 ? (
                        <div className="multiple-tasks-indicator">
                            {tasksForDay.length} tarefas
                        </div>
                    ) : (
                        tasksForDay.map((task, index) => (
                            <div key={index} className={`cronograma-task ${task.priority}`}>
                                {task.title}
                            </div>
                        ))
                    )}
                </div>
            );

            if (days.length === 7 || day === daysInMonth) {
                weeks.push(
                    <div key={weeks.length} className="cronograma-calendar-week">
                        {days}
                    </div>
                );
                days = [];
            }
        }

        return weeks;
    }, [cronogramas, user.sector_id, user.id, openResponseModal, openDayTasksModal, currentMonth, currentYear]);

    const memoizedCalendar = useMemo(() => renderCalendar(), [renderCalendar]);

    const handlePrevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        if (currentMonth === 0) {
            setCurrentYear((prevYear) => prevYear - 1);
        }
    };

    const handleNextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        if (currentMonth === 11) {
            setCurrentYear((prevYear) => prevYear + 1);
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="cronograma-calendar-container">
                <h1>Calendário de Tarefas</h1>
                <div className="cronograma-tab-container">
                    {equipes.map((equipe, index) => (
                        <div key={index} className="cronograma-tab">
                            <input
                                type="radio"
                                name="tab"
                                id={`tab${index}`}
                                className="cronograma-tab_input"
                                checked={selectedEquipe === equipe.name}
                                onChange={() => handleTabChange(equipe.name, index)}
                            />
                            <label className="cronograma-tab_label" htmlFor={`tab${index}`}>
                                {equipe.name}
                            </label>
                        </div>
                    ))}
                    <div className="cronograma-indicator" style={{ left: `${indicatorPosition}px` }} />
                </div>

                <div className="cronograma-header-container">
                    <button className="cronograma-add-task-button" onClick={() => openModal(null)}>Adicionar Tarefa</button>
                    <div className="cronograma-legenda-container">
                        <div className="cronograma-legenda-item">
                            <span className="cronograma-legenda-task normal" /> Normal
                        </div>
                        <div className="cronograma-legenda-item">
                            <span className="cronograma-legenda-task atencao" /> Atenção
                        </div>
                        <div className="cronograma-legenda-item">
                            <span className="cronograma-legenda-task urgente" /> Urgente
                        </div>
                    </div>
                </div>

                <div className="cronograma-calendar-navigation">
                    <button onClick={handlePrevMonth}>Anterior</button>
                    <span>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={handleNextMonth}>Próximo</button>
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
                        tiposTarefa={tiposTarefa} // Pass tiposTarefa to TaskModal
                        tipoTarefaId={tipoTarefaId} // Pass tipoTarefaId to TaskModal
                        setTipoTarefaId={setTipoTarefaId} // Pass setTipoTarefaId to TaskModal
                        attachments={attachments} // Pass attachments to TaskModal
                        setAttachments={setAttachments} // Pass setAttachments to TaskModal
                    />
                )}

                {responseModalIsOpen && (
                    <TaskResponseModal
                        task={selectedTask}
                        comments={comments}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        addComment={addComment}
                        closeModal={closeModal}
                        updateTaskStatus={updateTaskStatus}
                        user={user} // Passe o usuário autenticado para o modal
                        attachments={attachments} // Pass attachments to TaskResponseModal
                        setAttachments={setAttachments} // Ensure setAttachments is passed
                        users={users} // Pass the list of active users to TaskResponseModal
                    />
                )}

                {dayTasksModalIsOpen && (
                    <DayTasksModal
                        tasks={selectedDayTasks}
                        openResponseModal={openResponseModal}
                        closeModal={closeModal}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Cronograma;
