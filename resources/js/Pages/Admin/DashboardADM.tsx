import { Suspense, lazy, useState } from 'react';
import { usePage } from '@inertiajs/react';


// Carregar as páginas dinamicamente
const DynamicHomeAdm = lazy(() => import('@/Pages/Admin/HomeAdm'));
const DynamicUserTypes = lazy(() => import('@/Pages/Admin/UserTypes'));

export default function DashboardADM() {
    const { auth } = usePage().props;
    const [activePage, setActivePage] = useState("home");

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
