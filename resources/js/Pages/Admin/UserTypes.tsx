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

const UserTypes: React.FC = () => {
    const { userTypes, user } = usePage().props as { userTypes: UserType[], user: any };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [newUserType, setNewUserType] = useState<UserType>({ name: '', description: '' });
    const [editingUserType, setEditingUserType] = useState<UserType | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Novo estado para controle do modal de adição

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editingUserType) {
            setEditingUserType(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewUserType(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.post('/admin/user-types', newUserType, {
            onSuccess: () => {
                setSuccessMessage('Tipo de usuário adicionado com sucesso!');
                setNewUserType({ name: '', description: '' });
                setIsAddModalOpen(false); // Fecha o modal após a criação
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUserType) {
            Inertia.put(`/admin/user-types/${editingUserType.id}`, editingUserType, {
                onSuccess: () => {
                    setSuccessMessage('Tipo de usuário atualizado com sucesso!');
                    setEditingUserType(null);
                },
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const editarUsuario = (userType: UserType) => {
        setEditingUserType(userType);
    };

    const gerenciarPermissoes = (userType: UserType) => {
        setSelectedUserType(userType);
        setPermissionModalOpen(true);
    };

    const deletarUsuario = (id: number) => {
        if (window.confirm('Tem certeza de que deseja deletar este tipo de usuário?')) {
            Inertia.delete(`/admin/user-types/${id}`, {
                onSuccess: () => {
                    setSuccessMessage('Tipo de usuário deletado com sucesso!');
                },
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Tipos de Usuários</h1>

                {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
                                        <button className="btn editar" onClick={() => editarUsuario(userType)}>
                                            Editar
                                        </button>
                                        <button className="btn permissoes" onClick={() => gerenciarPermissoes(userType)}>
                                            Permissões
                                        </button>
                                        <button className="btn deletar" onClick={() => deletarUsuario(userType.id!)}>
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
                            <form onSubmit={editingUserType ? handleSubmitEdit : handleSubmit}>
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
                {isPermissionModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Permissões para {selectedUserType?.name}</h2>
                            <p>Aqui você pode gerenciar as permissões para este tipo de usuário.</p>
                            {/* Conteúdo do modal */}
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
