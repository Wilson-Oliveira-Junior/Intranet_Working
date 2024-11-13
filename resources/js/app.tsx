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
            if (name.startsWith('auth.')) {
                module.default.layout = AuthenticatedLayout;
            }
            return module;
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
