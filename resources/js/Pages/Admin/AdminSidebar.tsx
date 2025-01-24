import { Link } from '@inertiajs/react';
import { useState } from 'react';
import "../../../css/components/Sidebar.css";

const Menu = ({ title, icon, children, isOpen, toggle }) => (
    <div className="menu">
        <div onClick={toggle} className="menu-title">
            <i className={`fas ${icon}`}></i> {title}
            <i className={`fas fa-chevron-right ml-auto ${isOpen ? 'rotate-90' : ''}`}></i>
        </div>
        {isOpen && <div className="menu-content">{children}</div>}
    </div>
);

const AdminSidebar = ({ setActivePage }) => {
    const [openMenus, setOpenMenus] = useState({
        meuEspaco: false,
        tarefa: false,
        relatorios: false,
        documentos: false,
        gestao: false,
        financeiro: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu]
        }));
    };

    return (
        <div className="sidebar">
            <div id="teste" className="teste w-64 bg-white shadow-md p-4">
                <Link href="/admin/dashboard" className="sidebar-link">
                    <i className="fas fa-tv"></i> Dashboard
                </Link>
                <Link href="/cronograma" className="sidebar-link">
                    <i className="fas fa-calendar-alt" aria-label="Cronograma Equipes"></i>
                    Cronograma Equipes
                </Link>
                <Link href="/tarefas" className="sidebar-link">
                    <i className="fas fa-tasks" aria-label="Tarefas"></i>
                    Tarefas
                </Link>
                <Link href="/GUT" className="sidebar-link">
                    <i className="fas fa-sort-amount-up" aria-label="GUT - Priorização"></i>
                    GUT - Priorização
                </Link>
                <a href="#" className="sidebar-link">
                    <i className="fas fa-list-alt" aria-label="Pautas"></i>
                    Pautas
                </a>

                <Menu
                    title="Meu Espaço"
                    icon="fa-user"
                    isOpen={openMenus.meuEspaco}
                    toggle={() => toggleMenu('meuEspaco')}
                >
                    <Link href="/profile" className="sidebar-link">Meu Perfil</Link>
                    <Link href="/meu-cronograma" className="sidebar-link">Meu Cronograma</Link>
                    <Link href="/meu-calendario" className="sidebar-link">Meu Calendário</Link>
                </Menu>

                <Menu
                    title="Módulo de Tarefas"
                    icon="fa-tasks"
                    isOpen={openMenus.tarefa}
                    toggle={() => toggleMenu('tarefa')}
                >
                    <Link href="/admin/clients" className="sidebar-link">Clientes</Link>
                    <Link href="/tipo-tarefa" className="sidebar-link">Tipo de Tarefa</Link>
                    <Link href="/status" className="sidebar-link">Status</Link>
                    <Link href="/segmentos-clientes" className="sidebar-link">Segmentos Clientes</Link>
                    <Link href="/tipo-projeto" className="sidebar-link">Tipo de Projeto</Link>
                </Menu>

                <Menu
                    title="Relatórios"
                    icon="fa-clipboard"
                    isOpen={openMenus.relatorios}
                    toggle={() => toggleMenu('relatorios')}
                >
                    <Link href="/admin/clients" className="sidebar-link">Listagem de Clientes</Link>
                    <Link href="/listagem-ftps" className="sidebar-link">Listagem de FTPs</Link>
                    <Link href="/registro-senha" className="sidebar-link">Registro de Senha</Link>
                    <Link href="/relatorio-tarefas" className="sidebar-link">Relatório de Tarefas</Link>

                    <Menu
                        title="Documentos"
                        icon=""
                        isOpen={openMenus.documentos}
                        toggle={() => toggleMenu('documentos')}
                    >
                        <Link href="/documentos/administrativo" className="sidebar-link">Administrativo</Link>
                        <Link href="/documentos/atendimento" className="sidebar-link">Atendimento</Link>
                        <Link href="/documentos/comercial" className="sidebar-link">Comercial</Link>
                        <Link href="/documentos/criacao" className="sidebar-link">Criação</Link>
                        <Link href="/documentos/desenvolvimento" className="sidebar-link">Desenvolvimento</Link>
                        <Link href="/documentos/marketing" className="sidebar-link">Marketing</Link>
                    </Menu>
                </Menu>

                <Menu
                    title="Gestão"
                    icon="fa-tasks"
                    isOpen={openMenus.gestao}
                    toggle={() => toggleMenu('gestao')}
                >
                    <Link href="/admin/usertypes" className="sidebar-link">
                        <i className="fas fa-tasks" aria-label="Tipos de Usuários"></i> Tipos de Usuários
                    </Link>
                    <Link href="/admin/users" className="sidebar-link">
                        <i className="fas fa-users" aria-label="Usuários"></i> Usuários
                    </Link>
                    <Link href="/admin/setores" className="sidebar-link">
                        <i className="fas fa-building" aria-label="Setores"></i> Setores
                    </Link>
                    <Link href="/admin/permissoes" className="sidebar-link">
                        <i className="fas fa-lock" aria-label="Permissões"></i> Permissões
                    </Link>
                    <Link href="/admin/gatilhos" className="sidebar-link">
                        <i className="fas fa-lock" aria-label="Gatilhos"></i> Gatilhos
                    </Link>
                    <Link href="/admin/configuracao" className="sidebar-link">
                        <i className="fas fa-lock" aria-label="Configuração"></i> Configuração
                    </Link>
                </Menu>

                <Menu
                    title="Financeiro"
                    icon="fa-tasks"
                    isOpen={openMenus.financeiro}
                    toggle={() => toggleMenu('financeiro')}
                >
                    <Link href="/boletos-vencidos-asaas" className="sidebar-link">Boletos Vencidos Asaas</Link>
                    <Link href="/devedores-ca" className="sidebar-link">Devedores CA</Link>
                </Menu>

                <div className="section-title">REDES SOCIAIS</div>
                <a href="https://www.facebook.com/agencialogicadigital/" className="sidebar-link">
                    <i className="fab fa-facebook" aria-label="Facebook"></i>
                    Facebook
                </a>
                <a href="https://www.instagram.com/agencialogicadigital/" className="sidebar-link">
                    <i className="fab fa-instagram" aria-label="Instagram"></i>
                    Instagram
                </a>
                <a href="https://www.linkedin.com/company/logicadigital" className="sidebar-link">
                    <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
                    LinkedIn
                </a>
            </div>
        </div>
    );
}

export default AdminSidebar;
