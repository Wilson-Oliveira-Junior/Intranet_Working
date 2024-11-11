import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/usertypes.css';

interface Permission {
    id: number;
    name: string;
    label: string;
}

interface UserType {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

const UserTypes: React.FC = () => {
    const { userTypes, user, permissions } = usePage().props as { userTypes: UserType[], user: any, permissions: Permission[] };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
    const [newUserType, setNewUserType] = useState<UserType>({ name: '', description: '' });
    const [editingUserType, setEditingUserType] = useState<UserType | null>(null);
    const [userTypePermissions, setUserTypePermissions] = useState<number[]>([]); // Apenas IDs das permissões
    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage] = useState(10);

    // Correção do cálculo dos índices de permissão
    const totalPermissions = permissions.length;
    const indexOfLastPermission = currentPage * permissionsPerPage;
    const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage;

    const currentPermissions = permissions.slice(indexOfFirstPermission, indexOfLastPermission);

    const gerenciarPermissoes = (userType: UserType) => {
        setSelectedUserType(userType);
        setPermissionModalOpen(true);
        // Definindo as permissões selecionadas do tipo de usuário
        setUserTypePermissions(userType.permissions.map(p => p.id));
    };

    const deletarPermissao = (permissionId: number) => {
        if (window.confirm('Tem certeza de que deseja deletar esta permissão?')) {
            Inertia.delete(`/admin/user-types/${selectedUserType?.id}/permissions/${permissionId}`, {
                onSuccess: () => {
                    alert('Permissão deletada com sucesso!');
                    // Atualizar a lista de permissões após a exclusão
                    setUserTypePermissions(prevPermissions => prevPermissions.filter(p => p !== permissionId));
                },
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUserType) {
            Inertia.put(`/admin/user-types/${editingUserType.id}`, editingUserType, {
                onSuccess: () => {
                    setEditingUserType(null);
                    setIsAddModalOpen(false);
                }
            });
        } else {
            Inertia.post('/admin/user-types', newUserType, {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                }
            });
        }
    };

    const abrirEditarModal = (userType: UserType) => {
        setEditingUserType(userType);
        setIsAddModalOpen(true);
    };

    const associarPermissoes = (selectedPermissions: number[]) => {
        Inertia.post(`/admin/user-types/${selectedUserType.id}/permissions`, {
            permissions: selectedPermissions,
        }, {
            onSuccess: () => {
                alert('Permissões associadas com sucesso!');
                setPermissionModalOpen(false);
                setUserTypePermissions(selectedPermissions);
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePermissionToggle = (permissionId: number) => {
        setUserTypePermissions(prevPermissions => {
            if (prevPermissions.includes(permissionId)) {
                return prevPermissions.filter(id => id !== permissionId);
            } else {
                return [...prevPermissions, permissionId];
            }
        });
    };

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(totalPermissions / permissionsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Tipos de Usuários</h1>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTypes.map((userType) => (
                            <tr key={userType.id}>
                                <td>{userType.name}</td>
                                <td>{userType.description}</td>
                                <td>
                                    <button className="btn editar" onClick={() => abrirEditarModal(userType)}>Editar</button>
                                    <button className="btn permissoes" onClick={() => gerenciarPermissoes(userType)}>Permissões</button>
                                    <button className="btn deletar" onClick={() => {
                                        if (window.confirm('Tem certeza de que deseja excluir este tipo de usuário?')) {
                                            Inertia.delete(`/admin/user-types/${userType.id}`, {
                                                onSuccess: () => alert('Tipo de Usuário deletado com sucesso!'),
                                            });
                                        }
                                    }}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="btn novo" onClick={() => setIsAddModalOpen(true)}>Adicionar Novo Tipo de Usuário</button>

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
                                <button type="submit" className="btn novo">{editingUserType ? 'Atualizar Tipo de Usuário' : 'Adicionar Tipo de Usuário'}</button>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn fechar">Fechar</button>
                            </form>
                        </div>
                    </div>
                )}

                {isPermissionModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Gerenciar Permissões para: {selectedUserType?.name}</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    associarPermissoes(userTypePermissions);
                                }}
                            >
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Permissão</th>
                                            <th>Adicionar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPermissions.map((permission) => (
                                            <tr key={permission.id}>
                                                <td>{permission.label}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={userTypePermissions.includes(permission.id)}
                                                        onChange={() => handlePermissionToggle(permission.id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pagination">
                                    <button type="button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
                                    <span>Página {currentPage}</span>
                                    <button type="button" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastPermission >= totalPermissions}>Próxima</button>
                                </div>

                                <button type="submit" className="btn associar">Salvar Permissões</button>
                                <button type="button" onClick={() => setPermissionModalOpen(false)} className="btn fechar">Fechar</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default UserTypes;
