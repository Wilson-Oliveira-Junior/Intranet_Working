import { Link } from '@inertiajs/react';
import { useState } from 'react';
import "../../../css/components/Sidebar.css"

const AdminSidebar = ({ setActivePage }) => {
    const [openMenus, setOpenMenus] = useState({
        meuEspaco: false,
        tarefa: false,
        relatorios: false,
        documentos: false,
        gestao: false,
        gatilhos: false,
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
                <Link href="/" className="flex items-center py-2">
                    <i className="fas fa-tv"></i> Dashboard
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

                {/* Menu Meu Espaço */}
                <div className="flex flex-col">
                    <button onClick={() => toggleMenu('meuEspaco')} className="flex items-center py-2">
                        <i className="fas fa-user"></i> Meu Espaço
                        <i className={`fas fa-chevron-right ml-auto ${openMenus.meuEspaco ? 'rotate-90' : ''}`}></i>
                    </button>
                    {openMenus.meuEspaco && (
                        <div className="pl-6">
                            <Link href="/meu-perfil" className="py-2">Meu Perfil</Link>
                            <Link href="/meu-cronograma" className="py-2">Meu Cronograma</Link>
                            <Link href="/meu-calendario" className="py-2">Meu Calendário</Link>
                        </div>
                    )}
                </div>

                {/* Menu Tarefas */}
                <div className="flex flex-col">
                    <button onClick={() => toggleMenu('tarefa')} className="flex items-center py-2">
                        <i className="fas fa-tasks"></i> Tarefas
                        <i className={`fas fa-chevron-right ml-auto ${openMenus.tarefa ? 'rotate-90' : ''}`}></i>
                    </button>
                    {openMenus.tarefa && (
                        <div className="pl-6">
                            <Link href="/clientes" className="py-2">Clientes</Link>
                            <Link href="/tipo-tarefa" className="py-2">Tipo de Tarefa</Link>
                            <Link href="/status" className="py-2">Status</Link>
                            <Link href="/segmentos-clientes" className="py-2">Segmentos Clientes</Link>
                            <Link href="/tipo-projeto" className="py-2">Tipo de Projeto</Link>
                        </div>
                    )}
                </div>

                {/* Menu Relatórios */}
                <div className="flex flex-col">
                    <button onClick={() => toggleMenu('relatorios')} className="flex items-center py-2">
                        <i className="fas fa-clipboard"></i> Relatórios
                        <i className={`fas fa-chevron-right ml-auto ${openMenus.relatorios ? 'rotate-90' : ''}`}></i>
                    </button>
                    {openMenus.relatorios && (
                        <div className="pl-6">
                            <Link href="/listagem-clientes" className="py-2">Listagem de Clientes</Link>
                            <Link href="/listagem-ftps" className="py-2">Listagem de FTPs</Link>
                            <Link href="/registro-senha" className="py-2">Registro de Senha</Link>
                            <Link href="/relatorio-tarefas" className="py-2">Relatório de Tarefas</Link>

                            {/* Sub-menu Documentos */}
                            <div className="flex flex-col">
                                <button onClick={() => toggleMenu('documentos')} className="flex items-center py-2">
                                    Documentos
                                    <i className={`fas fa-chevron-right ml-auto ${openMenus.documentos ? 'rotate-90' : ''}`}></i>
                                </button>
                                {openMenus.documentos && (
                                    <div className="pl-6">
                                        <Link href="/documentos/administrativo" className="py-2">Administrativo</Link>
                                        <Link href="/documentos/atendimento" className="py-2">Atendimento</Link>
                                        <Link href="/documentos/comercial" className="py-2">Comercial</Link>
                                        <Link href="/documentos/criacao" className="py-2">Criação</Link>
                                        <Link href="/documentos/desenvolvimento" className="py-2">Desenvolvimento</Link>
                                        <Link href="/documentos/marketing" className="py-2">Marketing</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Menu Gestão */}
                <div className="flex flex-col">
                    <button onClick={() => toggleMenu('gestao')} className="flex items-center py-2">
                        <i className="fas fa-tasks"></i> Gestão
                        <i className={`fas fa-chevron-right ml-auto ${openMenus.gestao ? 'rotate-90' : ''}`}></i>
                    </button>
                    {openMenus.gestao && (
                        <div className="pl-6">
                            {/* Link para Tipos de Usuários */}
                            <Link href="/admin/usertypes" className="flex items-center py-2">
                                <i className="fas fa-tasks" aria-label="Tipos de Usuários"></i> Tipos de Usuários
                            </Link>
                            <button onClick={() => setActivePage("usuarios")} className="py-2">Usuários</button>
                            <button onClick={() => setActivePage("setores")} className="py-2">Setores</button>
                            <button onClick={() => setActivePage("permissoes")} className="py-2">Permissões</button>

                            {/* Sub-menu Gatilhos */}
                            <div className="flex flex-col">
                                <button onClick={() => toggleMenu('gatilhos')} className="flex items-center py-2">
                                    Gatilhos
                                    <i className={`fas fa-chevron-right ml-auto ${openMenus.gatilhos ? 'rotate-90' : ''}`}></i>
                                </button>
                                {openMenus.gatilhos && (
                                    <div className="pl-6">
                                        <button onClick={() => setActivePage("gatilhosGerais")} className="py-2">Gatilhos Gerais</button>
                                        <button onClick={() => setActivePage("configuracao")} className="py-2">Configuração</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Menu Financeiro */}
                <div className="flex flex-col">
                    <button onClick={() => toggleMenu('financeiro')} className="flex items-center py-2">
                        <i className="fas fa-tasks"></i> Financeiro
                        <i className={`fas fa-chevron-right ml-auto ${openMenus.financeiro ? 'rotate-90' : ''}`}></i>
                    </button>
                    {openMenus.financeiro && (
                        <div className="pl-6">
                            <Link href="/boletos-vencidos-asaas" className="py-2">Boletos Vencidos Asaas</Link>
                            <Link href="/devedores-ca" className="py-2">Devedores CA</Link>
                        </div>
                    )}
                </div>

                <div className="section-title">REDES SOCIAIS</div>
                <a href="https://www.facebook.com/agencialogicadigital/" className="flex items-center py-2">
                    <i className="fab fa-facebook" aria-label="Facebook"></i>
                    Facebook
                </a>
                <a href="https://www.instagram.com/agencialogicadigital/" className="flex items-center py-2">
                    <i className="fab fa-instagram" aria-label="Instagram"></i>
                    Instagram
                </a>
                <a href="https://www.linkedin.com/company/logicadigital" className="flex items-center py-2">
                    <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
                    LinkedIn
                </a>
            </div>
        </div>
    );
}

export default AdminSidebar;
