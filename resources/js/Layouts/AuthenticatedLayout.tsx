import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import SidebarADM from '@/Pages/Admin/AdminSidebar';
import '../../../resources/css/app.css'; // Importando o CSS global
import { route } from 'ziggy-js'; // Importar a função route para navegação
import axios from 'axios'; // Importar axios para fazer requisições HTTP


const Menu = ({ title, icon, children, isOpen, toggle }: { title: string; icon: string; children: ReactNode; isOpen: boolean; toggle: () => void }) => (
    <div className="flex flex-col">
        <button onClick={toggle} className="flex items-center py-2 menu-title">
            <i className={`fas ${icon}`}></i> {title}
            <i className={`fas fa-chevron-right ml-auto ${isOpen ? 'rotate-90' : ''}`}></i>
        </button>
        {isOpen && <div className="pl-6 menu-content">{children}</div>}
    </div>
);

const Authenticated = ({ header, children }: PropsWithChildren<{ header?: ReactNode }>) => {
    const { auth } = usePage().props;
    const user = (auth as { user?: { name: string } })?.user;
    const [darkMode, setDarkMode] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<{ id: number; message: string; read: boolean }[]>([]);

    useEffect(() => {
        if (!user) {
            window.location.href = (window as any).route('login');
        }
    }, [user]);

    useEffect(() => {
        const savedMode = localStorage.getItem('dark-mode');
        if (savedMode) {
            setDarkMode(savedMode === 'true');
            document.body.classList.toggle('dark-mode', savedMode === 'true');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('dark-mode', newMode.toString());
            document.body.classList.toggle('dark-mode', newMode);
            return newMode;
        });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
        // Atualizar o status da notificação no servidor
        axios.post(`/notifications/${id}/mark-as-read`);
    };

    useEffect(() => {
        const toggle = document.getElementById('dark-mode-toggle');
        const curtain = document.querySelector('.curtain');
        const modeText = document.getElementById('mode-text');

        const handleToggle = () => {
            if ((toggle as HTMLInputElement).checked) {
                (curtain as HTMLElement).style.transform = 'scaleX(1)';
                if (modeText) modeText.textContent = 'Modo Claro';
                if (modeText) modeText.classList.add('text-white'); // Add class to change text color to white
            } else {
                (curtain as HTMLElement).style.transform = 'scaleX(0)';
                if (modeText) modeText.textContent = 'Modo Escuro';
                if (modeText) modeText.classList.remove('text-white'); // Remove class to reset text color
            }
        };

        if (toggle) {
            toggle.addEventListener('change', handleToggle);
        } else {
            console.error('Toggle Dark Mode button not found');
        }

        // Set initial text color based on the current mode
        if (toggle && modeText) {
            if ((toggle as HTMLInputElement).checked) {
                modeText.classList.add('text-white'); // White for dark mode
            } else {
                modeText.classList.remove('text-white'); // Black for light mode
            }
        }

        return () => {
            if (toggle) toggle.removeEventListener('change', handleToggle);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notifications');
                if (Array.isArray(response.data)) {
                    setNotifications(response.data);
                } else {
                    console.error('Notificações não são um array:', response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar notificações:', error);
            }
        };

        fetchNotifications();
    }, []);

    const hasUnreadNotifications = Array.isArray(notifications) && notifications.some(notification => !notification.read);

    if (!user) {
        return <div>Redirecting...</div>;
    }

    return (
        <div className="min-h-screen">
            <nav className="navbar" id="topbar">
                <div className="flex items-center justify-between w-full h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="logo" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <form id="dark-mode-form" className="flex items-center">
                            <label className="switch-layout">
                                <input id="dark-mode-toggle" className="toggle checkbox-layout" type="checkbox" name="Dark mode" role="switch" value="on" onChange={toggleDarkMode} checked={darkMode} />
                                <span className="slider-layout"></span>
                            </label>
                            <label htmlFor="dark-mode-toggle" className="sr">Dark Mode</label>
                            <div className="curtain"></div>
                            <span id="mode-text" className={`ml-2 ${darkMode ? 'text-white' : 'text-black'}`}>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                        </form>
                        <div className="relative ms-3">
                            <button type="button" className={`notification-button ${hasUnreadNotifications ? 'has-unread' : ''}`} onClick={toggleNotifications}>
                                <i className={`bi ${hasUnreadNotifications ? 'bi-bell-fill' : 'bi-bell'}`}></i>
                            </button>
                            <div className={`notification-content ${notificationsOpen ? 'show' : ''}`}>
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification.id} className="notification-item" onClick={() => markAsRead(notification.id)}>
                                            {notification.message}
                                        </div>
                                    ))
                                ) : (
                                    <div className="notification-item">Nenhuma notificação</div>
                                )}
                                <Link href={route('notifications')} className="notification-item">Ver todas as notificações</Link>
                            </div>
                        </div>
                        <div className="relative ms-3">
                            <button type="button" className="dropdown-button" onClick={toggleDropdown}>
                                <i className="bi bi-person-circle"></i>
                                <span className="ml-2">{user.name}</span>
                                <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a 1 1 010-1.414z" clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                                <Link href={route('profile.show')} className="dropdown-item">Perfil</Link>
                                <Link href={route('settings')} className="dropdown-item">Configurações</Link>
                                <Link href={route('notifications')} className="dropdown-item">Notificações</Link>
                                <Link href={route('help')} className="dropdown-item">Ajuda</Link>
                                <button onClick={() => route('logout')} className="dropdown-item">Sair</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Renderizar o sidebar fixo para admin */}
            <div className="flex">
                <SidebarADM user={user} setActivePage={() => {}} /> {/* Sidebar fixo para admin */}

                <div className="flex-1 py-2">
                    {/* Cabeçalho se fornecido */}
                    {header && (
                        <header className="header">
                            <div className="container mx-auto">
                                {header}
                            </div>
                        </header>
                    )}

                    {/* Conteúdo principal da página */}
                    <main className="content container mx-auto">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default Authenticated;
