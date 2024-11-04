import { Link } from '@inertiajs/react';

const GuestSidebar = ({ user }: { user?: any }) => {
    return (
        <div className="sidebar">
        <div className="w-64 bg-white shadow-md p-4">
            {user && user.is_admin && (
                <Link href="/admin" className="flex items-center py-2">
                    <i className="fas fa-user-shield" aria-label="Admin"></i>
                    Admin
                </Link>
            )}
            <Link href="/" className="flex items-center py-2">
                <i className="fas fa-tv" aria-label="Dashboard"></i>
                Dashboard
            </Link>
            <Link href="/cronograma" className="flex items-center py-2">
                <i className="fas fa-calendar-alt" aria-label="Cronograma Equipes"></i>
                Cronograma Equipes
            </Link>
            <Link href="/tarefas" className="flex items-center py-2">
                <i className="fas fa-tasks" aria-label="Tarefas"></i>
                Tarefas
            </Link>
            <Link href="/GUT" className="flex items-center py-2">
                <i className="fas fa-sort-amount-up" aria-label="GUT - Priorização"></i>
                GUT - Priorização
            </Link>
            <a href="#" className="flex items-center py-2">
                <i className="fas fa-list-alt" aria-label="Pautas"></i>
                Pautas
            </a>
            <a href="#" className="flex items-center py-2">
                <i className="fas fa-user" aria-label="Meu espaço"></i>
                Meu espaço
                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto' }}></i>
            </a>
            <a href="#" className="flex items-center py-2">
                <i className="fas fa-user" aria-label="Meu espaço"></i>
                Módulos da Tarefa
                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto' }}></i>
            </a>
            <a href="#" className="flex items-center py-2">
                <i className="fas fa-clipboard" aria-label="Relatórios"></i>
                Relatórios
                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto' }}></i>
            </a>
            <a href="#" className="flex items-center py-2">
                <i className="fas fa-tasks" aria-label="Gestão"></i>
                Gestão
                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto' }}></i>
            </a>
            <a href="#" className="flex items-center py-2">
                <i className="fas fa-tasks" aria-label="Gestão"></i>
                Financeiro
                <i className="fas fa-chevron-right" style={{ marginLeft: 'auto' }}></i>
            </a>
            <div className="section-title">REDES SOCIAIS</div>
            <a href="https://www.facebook.com/agencialogicadigital/" className="flex items-center py-2">
                <i className="fab fa-facebook" aria-label="Facebook"></i>
                Facebook
            </a>
            <a href="https://www.instagram.com/agencialogicadigital/" className="flex items-center py-2">
                <i className="fab fa-instagram" aria-label="Instagram"></i>
                Instagram
            </a>
            <a href="https://www.youtube.com/channel/UCibYLnhb7tT6febvhlZtMXg" className="flex items-center py-2">
                <i className="fab fa-youtube" aria-label="YouTube"></i>
                YouTube
            </a>
            <a href="https://www.linkedin.com/company/l-gica-digital/mycompany/" className="flex items-center py-2">
                <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
                LinkedIn
            </a>
            <a href="https://br.pinterest.com/logicadigital" className="flex items-center py-2">
                <i className="fab fa-pinterest" aria-label="Pinterest"></i>
                Pinterest
            </a>
        </div>
        </div>
    );
};

export default GuestSidebar;
