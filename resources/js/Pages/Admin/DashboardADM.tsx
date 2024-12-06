import { Suspense, lazy, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// Carregar as páginas dinamicamente
const DynamicHomeAdm = lazy(() => import('@/Pages/Admin/HomeAdm'));
const DynamicUserTypes = lazy(() => import('@/Pages/Admin/UserTypes'));

export default function DashboardADM() {
    const { auth } = usePage().props;
    const user = auth?.user; // Ensure user is defined
    const [activePage, setActivePage] = useState("home");

    useEffect(() => {
        if (!user) {
            window.location.href = route('login');
        }
    }, [user]);

    if (!user) {
        return <div>Redirecting...</div>; // Show a message while redirecting
    }

    // Função para renderizar a página ativa
    const renderPage = () => {
        switch (activePage) {
            case "userTypes":
                return <DynamicUserTypes />;
            default:
                return <DynamicHomeAdm />;
        }
    };

    return (
        <div className="flex">
            <div>
                <Suspense fallback={<div>Carregando...</div>}>
                    {renderPage()}
                </Suspense>
            </div>
        </div>
    );
}
