import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SidebarADM from '@/Pages/Admin/AdminSidebar';
import { usePage } from '@inertiajs/react';
import { Suspense, lazy, useState } from 'react';


const DynamicHomeAdm = lazy(() => import('@/Pages/Admin/HomeAdm'));
const DynamicUserTypes = lazy(() => import('@/Pages/Admin/UserTypes'));

export default function DashboardADM() {
    const { auth } = usePage().props;
    const [activePage, setActivePage] = useState("home");

    const renderPage = () => {
        switch (activePage) {
            case "userTypes":
                return <DynamicUserTypes />;
            case "usuarios":
                return <DynamicUsuarios />;
            default:
                return <DynamicHomeAdm />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin" />

            <div className="flex">
                <SidebarADM user={auth.user} setActivePage={setActivePage} /> {/* Passe setActivePage aqui */}
                <div className="flex-1 py-12">
                    <Suspense fallback={<div>Carregando...</div>}>
                        {renderPage()}
                    </Suspense>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
