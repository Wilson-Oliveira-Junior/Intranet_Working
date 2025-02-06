import ApplicationLogo from '@/Components/ApplicationLogo';
import Sidebar from '@/Components/Sidebar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';

interface EmployeeLayoutProps {
    user?: any;
    header?: React.ReactNode;
}

export default function EmployeeLayout({ children, user, header }: PropsWithChildren<EmployeeLayoutProps>) {
    const [darkMode, setDarkMode] = useState(false);

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

    useEffect(() => {
        const toggle = document.getElementById('dark-mode');
        const curtain = document.querySelector('.curtain');
        const modeText = document.getElementById('mode-text');

        const handleToggle = () => {
            if (toggle.checked) {
                curtain.style.transform = 'scaleX(1)';
                modeText.textContent = 'Modo Claro';
                modeText.classList.add('text-white'); // Add class to change text color to white
            } else {
                curtain.style.transform = 'scaleX(0)';
                modeText.textContent = 'Modo Escuro';
                modeText.classList.remove('text-white'); // Remove class to reset text color
            }
        };

        toggle.addEventListener('change', handleToggle);

        // Set initial text color based on the current mode
        if (toggle && modeText) {
            if (toggle.checked) {
                modeText.classList.add('text-white'); // White for dark mode
            } else {
                modeText.classList.remove('text-white'); // Black for light mode
            }
        }

        return () => {
            toggle.removeEventListener('change', handleToggle);
        };
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Conteúdo Principal */}
            <div className="flex-1 p-6">
                <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
                    <div>
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-gray-200" />
                        </Link>
                    </div>

                    {/* Renderiza o header aqui, se passado */}
                    {header && <div className="mb-4">{header}</div>}

                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                        <form className="flex items-center">
                            <input id="dark-mode" className="toggle" type="checkbox" name="Dark mode" role="switch" value="on" onChange={toggleDarkMode} checked={darkMode} />
                            <label htmlFor="dark-mode" className="sr">Dark Mode</label>
                            <div className="curtain"></div>
                            <span id="mode-text" className={`ml-2 ${darkMode ? 'text-white' : 'text-black'}`}>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                        </form>
                        <div className="relative ms-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-200 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                                            {user.name}
                                            <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd"/>
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="mt-6 w-full overflow-hidden px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
