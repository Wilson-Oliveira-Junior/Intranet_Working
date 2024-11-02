import ApplicationLogo from '@/Components/ApplicationLogo';
import Sidebar from '@/Components/Sidebar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface EmployeeLayoutProps {
    user?: any;            
    header?: React.ReactNode;
}

export default function EmployeeLayout({ children, user, header }: PropsWithChildren<EmployeeLayoutProps>) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Conteúdo Principal */}
            <div className="flex-1 p-6">
                <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
                    <div>
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                        </Link>
                    </div>

                    {/* Renderiza o header aqui, se passado */}
                    {header && <div className="mb-4">{header}</div>}

                    <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
