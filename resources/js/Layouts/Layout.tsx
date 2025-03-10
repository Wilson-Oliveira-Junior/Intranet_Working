import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';

export default function Layout({ children }: PropsWithChildren) {
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
        const toggle = document.getElementById('dark-mode-toggle');
        const curtain = document.querySelector('.curtain');
        const modeText = document.getElementById('mode-text');

        const handleToggle = () => {
            if (toggle && toggle.checked) {
                if (curtain) curtain.style.transform = 'scaleX(1)';
                if (modeText) {
                    modeText.textContent = 'Modo Claro';
                    modeText.classList.add('text-white'); // Add class to change text color to white
                }
            } else {
                if (curtain) curtain.style.transform = 'scaleX(0)';
                if (modeText) {
                    modeText.textContent = 'Modo Escuro';
                    modeText.classList.remove('text-white'); // Remove class to reset text color
                }
            }
        };

        if (toggle) toggle.addEventListener('change', handleToggle);

        // Set initial text color based on the current mode
        if (toggle && modeText) {
            if (toggle.checked) {
                modeText.classList.add('text-white'); // White for dark mode
            } else {
                modeText.classList.remove('text-white'); // Black for light mode
            }
        }

        return () => {
            if (toggle) toggle.removeEventListener('change', handleToggle);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo size="400px" className="fill-current text-gray-500 dark:text-gray-200" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
