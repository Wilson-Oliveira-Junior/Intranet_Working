import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/cronograma.css';

const Cronograma = ({ user, teamSchedules, sectors, users }) => {
    const [cronogramas, setCronogramas] = useState(teamSchedules || []);
    const [equipes, setEquipes] = useState(sectors || []);
    const [selectedEquipe, setSelectedEquipe] = useState(user?.sector?.name || '');
    const [indicatorPosition, setIndicatorPosition] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [reminderDate, setReminderDate] = useState('');
    const [priority, setPriority] = useState('');
    const [followerId, setFollowerId] = useState(null);
    const [taskType, setTaskType] = useState('sector');
    const [clientId, setClientId] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [sectorUsers, setSectorUsers] = useState([]);
    const [taskStatus, setTaskStatus] = useState('aberto');

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    useEffect(() => {
        const fetchCronogramas = async () => {
            try {
                const response = await fetch(`/api/tasks?equipe=${selectedEquipe}`);
                const data = await response.json();
                setCronogramas(data || []);
            } catch (error) {
                setCronogramas([]);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await fetch('/api/clients');
                const data = await response.json();
                setClients(data || []);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        fetchCronogramas();
        fetchClients();
    }, [selectedEquipe]);

    const fetchSectorUsers = (sectorId) => {
        const filteredUsers = users.filter(user => user.sector_id === parseInt(sectorId));
        setSectorUsers(filteredUsers);
    };

    useEffect(() => {
        if (selectedSector) {
            fetchSectorUsers(selectedSector);
        }
    }, [selectedSector]);

    const handleTabChange = (equipe, index) => {
        setSelectedEquipe(equipe);
        setIndicatorPosition(index * 132);
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setTaskTitle(task ? task.title : '');
        setTaskDescription(task ? task.description : '');
        setReminderDate(task ? task.date : '');
        setPriority(task ? task.priority : 'normal');
        setSelectedSector(task ? task.sector_id.toString() : '');
        setTaskStatus(task ? task.status : 'aberto');
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedTask(null);
        setReminderDate('');
        setPriority('');
        setFollowerId(null);
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatus('aberto');
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
                console.error('Erro ao analisar JSON:', e);
                throw new Error('Erro ao analisar JSON: ' + responseText);
            }

            setCronogramas((prevCronogramas) => [...prevCronogramas, data]);
        } catch (error) {
            console.error('Erro ao salvar a tarefa:', error);
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
                console.error('Erro ao analisar JSON:', e);
                throw new Error('Erro ao analisar JSON: ' + responseText);
            }

            setCronogramas((prevCronogramas) =>
                prevCronogramas.map((task) => (task.id === selectedTask.id ? data : task))
            );
        } catch (error) {
            console.error('Erro ao atualizar a tarefa:', error);
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

    const renderCalendar = () => {
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
                return taskDate.getDate() === day && taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear && (task.sector_id === user.sector_id || task.user_id === user.id);
            });
            console.log(`Tasks for day ${day}:`, tasksForDay); // Adicione esta linha para depuração
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
    };

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

                <div>{renderCalendar()}</div>

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
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

const TaskModal = ({
    taskType,
    setTaskType,
    taskTitle,
    setTaskTitle,
    taskDescription,
    setTaskDescription,
    reminderDate,
    setReminderDate,
    clientId,
    setClientId,
    clients,
    selectedSector,
    setSelectedSector,
    followerId,
    setFollowerId,
    sectorUsers,
    saveTaskDetails,
    updateTaskDetails,
    deleteTask,
    selectedTask,
    closeModal,
    priority,
    setPriority,
    taskStatus,
    setTaskStatus,
    equipes,
    fetchSectorUsers,
}) => (
    <div className="modal">
        <div className="modal-content">
            {selectedTask ? (
                <h2>{selectedTask.title}</h2>
            ) : (
                <h2>Adicionar Tarefa</h2>
            )}
            <div className="tab-container">
                <div className="tab">
                    <input
                        type="radio"
                        name="taskType"
                        id="sectorTab"
                        className="tab_input"
                        checked={taskType === 'sector'}
                        onChange={() => setTaskType('sector')}
                    />
                    <label className="tab_label" htmlFor="sectorTab">
                        Setor
                    </label>
                </div>
                <div className="tab">
                    <input
                        type="radio"
                        name="taskType"
                        id="individualTab"
                        className="tab_input"
                        checked={taskType === 'individual'}
                        onChange={() => setTaskType('individual')}
                    />
                    <label className="tab_label" htmlFor="individualTab">
                        Individual
                    </label>
                </div>
            </div>
            <input
                type="text"
                placeholder="Título da Tarefa (obrigatório)"
                className="modal-input"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Descrição da Tarefa"
                className="modal-input"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <input
                type="date"
                className="modal-input"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
            />
            <select
                className="modal-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="normal">Normal</option>
                <option value="atencao">Atenção</option>
                <option value="urgente">Urgente</option>
            </select>
            <select
                className="modal-input"
                value={clientId || ''}
                onChange={(e) => setClientId(e.target.value)}
            >
                <option value="">Selecione um Cliente</option>
                {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                        {client.nome}
                    </option>
                ))}
            </select>
            {taskType === 'sector' && (
                <select
                    className="modal-input"
                    value={selectedSector || ''}
                    onChange={(e) => setSelectedSector(e.target.value)}
                >
                    <option value="">Selecione um Setor</option>
                    {equipes.map((equipe, index) => (
                        <option key={index} value={equipe.id}>
                            {equipe.name}
                        </option>
                    ))}
                </select>
            )}
            {taskType === 'individual' && (
                <>
                    <select
                        className="modal-input"
                        value={selectedSector || ''}
                        onChange={(e) => {
                            setSelectedSector(e.target.value);
                            fetchSectorUsers(e.target.value);
                        }}
                    >
                        <option value="">Selecione um Setor</option>
                        {equipes.map((equipe, index) => (
                            <option key={index} value={equipe.id}>
                                {equipe.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="modal-input"
                        value={followerId || ''}
                        onChange={(e) => setFollowerId(e.target.value)}
                    >
                        <option value="">Selecione um Usuário</option>
                        {sectorUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </>
            )}
            <button onClick={selectedTask ? updateTaskDetails : saveTaskDetails} className="modal-button">
                {selectedTask ? 'Atualizar' : 'Salvar'}
            </button>
            {selectedTask && (
                <button onClick={() => deleteTask(selectedTask.id)} className="modal-button">
                    Deletar
                </button>
            )}
            <button onClick={closeModal} className="modal-button">
                Fechar
            </button>
        </div>
    </div>
);

export default Cronograma;
