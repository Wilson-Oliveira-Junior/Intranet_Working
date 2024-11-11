import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/usertypes.css';

interface UserType {
    id?: number;
    name: string;
    description: string;
}

interface Permission {
    id: number;
    name: string;
    label: string;
}

const UserTypes: React.FC = () => {
    // Pegando os dados do props passado pela página
    const { userTypes, user, permissions } = usePage().props as { userTypes: UserType[], user: any, permissions: Permission[] };

    // Se o usuário não estiver autenticado, exibe uma mensagem
    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    // Estado para o tipo de usuário selecionado e o estado de abertura do modal
    const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
    const [newUserType, setNewUserType] = useState<UserType>({ name: '', description: '' });
    const [editingUserType, setEditingUserType] = useState<UserType | null>(null);

    // Função para abrir o modal de permissões
    const gerenciarPermissoes = (userType: UserType) => {
        setSelectedUserType(userType);  // Define o tipo de usuário selecionado
        setPermissionModalOpen(true);    // Abre o modal de permissões
    };

    // Função para deletar a permissão de um tipo de usuário
    const deletarPermissao = (permissionId: number) => {
        if (window.confirm('Tem certeza de que deseja deletar esta permissão?')) {
            Inertia.delete(`/admin/user-types/${selectedUserType?.id}/permissions/${permissionId}`, {
                onSuccess: () => {
                    alert('Permissão deletada com sucesso!');
                },
                preserveState: true,  // Preserva o estado atual da página
                preserveScroll: true, // Preserva o scroll
                replace: true,         // Substitui o conteúdo da página
            });
        }
    };

    // Função para manipular mudanças nos inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editingUserType) {
            setEditingUserType({
                ...editingUserType,
                [name]: value,
            });
        } else {
            setNewUserType({
                ...newUserType,
                [name]: value,
            });
        }
    };

    // Função de envio para criar ou editar tipo de usuário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUserType) {
            // Submissão para editar tipo de usuário
            Inertia.put(`/admin/user-types/${editingUserType.id}`, editingUserType, {
                onSuccess: () => {
                    setEditingUserType(null);
                    setIsAddModalOpen(false);
                }
            });
        } else {
            // Submissão para adicionar novo tipo de usuário
            Inertia.post('/admin/user-types', newUserType, {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                }
            });
        }
    };

    // Função para abrir o modal de edição
    const abrirEditarModal = (userType: UserType) => {
        setEditingUserType(userType);
        setIsAddModalOpen(true);
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Tipos de Usuários</h1>

                {/* Tabela para exibir todos os tipos de usuários */}
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(userTypes) && userTypes.length > 0 ? (
                            userTypes.map((userType) => (
                                <tr key={userType.id}>
                                    <td>{userType.name}</td>
                                    <td>{userType.description}</td>
                                    <td>
                                        {/* Botão para editar tipo de usuário */}
                                        <button className="btn editar" onClick={() => abrirEditarModal(userType)}>
                                            Editar
                                        </button>
                                          {/* Botão para gerenciar permissões do tipo de usuário */}
                                          <button className="btn permissoes" onClick={() => gerenciarPermissoes(userType)}>
                                            Permissões
                                        </button>
                                        {/* Botão para deletar tipo de usuário */}
                                        <button
                                            className="btn deletar"
                                            onClick={() =>
                                                window.confirm('Tem certeza de que deseja excluir este tipo de usuário?') &&
                                                Inertia.delete(`/admin/user-types/${userType.id}`, {
                                                    onSuccess: () => alert('Tipo de Usuário deletado com sucesso!'),
                                                })
                                            }
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Nenhum tipo de usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Botão para abrir o modal de adição */}
                <button className="btn novo" onClick={() => setIsAddModalOpen(true)}>
                    Adicionar Novo Tipo de Usuário
                </button>

                {/* Modal de Adição de Tipo de Usuário */}
                {isAddModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>{editingUserType ? 'Editar Tipo de Usuário' : 'Adicionar Novo Tipo de Usuário'}</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nome"
                                    value={editingUserType ? editingUserType.name : newUserType.name}
                                    onChange={handleChange}
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Descrição"
                                    value={editingUserType ? editingUserType.description : newUserType.description}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit" className="btn novo">
                                    {editingUserType ? 'Atualizar Tipo de Usuário' : 'Adicionar Tipo de Usuário'}
                                </button>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn fechar">
                                    Fechar
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Permissões */}
                {isPermissionModalOpen && selectedUserType && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Permissões para {selectedUserType.name}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Label</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions && permissions.length > 0 ? (
                                        permissions.map((permission) => (
                                            <tr key={permission.id}>
                                                <td>{permission.id}</td>
                                                <td>{permission.name}</td>
                                                <td>{permission.label}</td>
                                                <td>
                                                    {/* Botão de deletar a permissão */}
                                                    <button
                                                        className="btn deletar"
                                                        onClick={() => deletarPermissao(permission.id)}
                                                    >
                                                        Deletar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">
                                                Nenhuma permissão encontrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Botão para fechar o modal */}
                            <button onClick={() => setPermissionModalOpen(false)} className="btn fechar">
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default UserTypes;
