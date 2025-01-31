import '../css/app.css';
import '../css/components/Sidebar.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';
import { resolvePageComponent } from './resolvePageComponent';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log('Resolving component for page:', name);
        const pages = import.meta.glob('./Pages/**/*.tsx');
        console.log('Available pages:', Object.keys(pages));
        return resolvePageComponent(name, pages).then((module) => {
            console.log('Resolved module:', module);
            if (name.startsWith('auth.')) {
                module.default.layout = AuthenticatedLayout;
            }
            return module;
        }).catch(error => {
            console.error('Error resolving component:', error);
            throw error;
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

function registerDarkModeToggle() {
    const toggleDarkMode = document.getElementById('toggle-dark-mode');
    const body = document.body;

    if (toggleDarkMode) {
        console.log('Toggle Dark Mode button found');
        toggleDarkMode.addEventListener('click', function () {
            console.log('Toggle Dark Mode button clicked');
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                console.log('Dark mode enabled');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                console.log('Dark mode disabled');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    } else {
        console.log('Toggle Dark Mode button not found');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Load the user's preference from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // Register the dark mode toggle after the initial render
    registerDarkModeToggle();

    // Use MutationObserver to register the dark mode toggle when the button is added to the DOM
    const observer = new MutationObserver(() => {
        registerDarkModeToggle();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
